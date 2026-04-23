// deno-lint-ignore-file no-explicit-any
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { packageId, requirements } = await req.json();
    if (!packageId) throw new Error("packageId required");

    // Load package + parent gig
    const { data: pkg, error: pErr } = await admin
      .from("gig_packages")
      .select("id,gig_id,tier,title,price_cents,currency")
      .eq("id", packageId)
      .single();
    if (pErr || !pkg) throw new Error("Package not found");

    const { data: gig } = await admin
      .from("gigs")
      .select("id,seller_id,title,slug,cover_url,status")
      .eq("id", pkg.gig_id)
      .single();
    if (!gig || gig.status !== "active") throw new Error("Gig not available");
    if (gig.seller_id === user.id) throw new Error("You can't buy your own gig");

    // Create draft order
    const { data: order, error: oErr } = await admin
      .from("gig_orders")
      .insert({
        gig_id: gig.id,
        package_id: pkg.id,
        buyer_id: user.id,
        seller_id: gig.seller_id,
        amount_cents: pkg.price_cents,
        currency: pkg.currency,
        status: "pending",
        requirements: requirements ?? null,
      })
      .select()
      .single();
    if (oErr || !order) throw new Error(oErr?.message ?? "Could not create order");

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
    const origin = req.headers.get("origin") ?? "https://gigvora.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: pkg.currency,
            unit_amount: pkg.price_cents,
            product_data: {
              name: `${gig.title} — ${pkg.title}`,
              images: gig.cover_url ? [gig.cover_url] : undefined,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_id: order.id,
        gig_id: gig.id,
        package_id: pkg.id,
        buyer_id: user.id,
        seller_id: gig.seller_id,
      },
      success_url: `${origin}/marketplace/checkout-return?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/marketplace/checkout-return?status=cancel`,
    });

    await admin
      .from("gig_orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
