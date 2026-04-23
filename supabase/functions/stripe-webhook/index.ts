// deno-lint-ignore-file no-explicit-any
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

serve(async (req) => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const whSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !whSecret) {
    return new Response("Stripe not configured", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig!, whSecret);
  } catch (e: any) {
    return new Response(`Bad signature: ${e?.message}`, { status: 400 });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const orderId = s.metadata?.order_id;
        if (orderId) {
          await admin
            .from("gig_orders")
            .update({
              status: "paid",
              stripe_payment_intent: (s.payment_intent as string) ?? null,
            })
            .eq("id", orderId);
        }
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const orderId = s.metadata?.order_id;
        if (orderId) {
          await admin.from("gig_orders").update({ status: "cancelled" }).eq("id", orderId);
        }
        break;
      }
      case "charge.refunded": {
        const ch = event.data.object as Stripe.Charge;
        if (ch.payment_intent) {
          await admin
            .from("gig_orders")
            .update({ status: "refunded" })
            .eq("stripe_payment_intent", ch.payment_intent as string);
        }
        break;
      }
      case "account.updated": {
        const acc = event.data.object as Stripe.Account;
        await admin
          .from("seller_accounts")
          .update({
            charges_enabled: acc.charges_enabled ?? false,
            payouts_enabled: acc.payouts_enabled ?? false,
            details_submitted: acc.details_submitted ?? false,
          })
          .eq("stripe_account_id", acc.id);
        break;
      }
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(`Handler error: ${e?.message}`, { status: 500 });
  }
});
