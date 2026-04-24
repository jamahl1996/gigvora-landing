-- Phase 7.6 — Commerce & Payments schema
-- Tables: orders, invoices, payments, payouts
-- Strict participant-only RLS; finance-admin escalation.

-- ─────────────────────────────────────────────────────────────────────────
-- 1. orders
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    text UNIQUE NOT NULL DEFAULT ('ORD-' || to_char(now(),'YYYYMMDD') || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  buyer_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  seller_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  gig_id          uuid REFERENCES public.gigs(id) ON DELETE SET NULL,
  service_id      uuid REFERENCES public.services(id) ON DELETE SET NULL,
  job_id          uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  project_id      uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  tier_name       text,
  amount_cents    integer NOT NULL CHECK (amount_cents >= 0),
  fee_cents       integer NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  currency        text NOT NULL DEFAULT 'USD',
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','in_progress','delivered','completed','cancelled','disputed','refunded')),
  delivery_due_at timestamptz,
  delivered_at    timestamptz,
  completed_at    timestamptz,
  cancelled_at    timestamptz,
  notes           text,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (buyer_id <> seller_id)
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders visible to participants" ON public.orders FOR SELECT
  USING (
    auth.uid() IN (buyer_id, seller_id)
    OR public.has_role(auth.uid(), 'finance-admin'::app_role)
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
    OR public.has_role(auth.uid(), 'dispute-mgr'::app_role)
  );
CREATE POLICY "Buyer creates orders" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Participants update orders" ON public.orders FOR UPDATE
  USING (auth.uid() IN (buyer_id, seller_id) OR public.has_role(auth.uid(), 'finance-admin'::app_role) OR public.has_role(auth.uid(), 'super-admin'::app_role));
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE
  USING (public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_orders_buyer ON public.orders(buyer_id, created_at DESC);
CREATE INDEX idx_orders_seller ON public.orders(seller_id, created_at DESC);
CREATE INDEX idx_orders_status ON public.orders(status, created_at DESC);
CREATE INDEX idx_orders_gig ON public.orders(gig_id);

CREATE TRIGGER trg_orders_touch BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 2. invoices
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.invoices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number  text UNIQUE NOT NULL DEFAULT ('INV-' || to_char(now(),'YYYYMMDD') || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  issuer_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,        -- seller
  recipient_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,        -- buyer
  organization_id text REFERENCES public.organizations(id) ON DELETE SET NULL,
  order_id        uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  project_id      uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  line_items      jsonb NOT NULL DEFAULT '[]'::jsonb,   -- [{description,qty,unit_cents,total_cents}]
  subtotal_cents  integer NOT NULL CHECK (subtotal_cents >= 0),
  tax_cents       integer NOT NULL DEFAULT 0 CHECK (tax_cents >= 0),
  total_cents     integer NOT NULL CHECK (total_cents >= 0),
  amount_paid_cents integer NOT NULL DEFAULT 0 CHECK (amount_paid_cents >= 0),
  currency        text NOT NULL DEFAULT 'USD',
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','viewed','partially_paid','paid','overdue','void','refunded')),
  issued_at       timestamptz,
  due_at          timestamptz,
  paid_at         timestamptz,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Invoices visible to participants" ON public.invoices FOR SELECT
  USING (
    auth.uid() IN (issuer_id, recipient_id)
    OR public.has_role(auth.uid(), 'finance-admin'::app_role)
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
  );
CREATE POLICY "Issuer creates invoices" ON public.invoices FOR INSERT TO authenticated
  WITH CHECK (issuer_id = auth.uid());
CREATE POLICY "Issuer updates invoices" ON public.invoices FOR UPDATE
  USING (issuer_id = auth.uid() OR public.has_role(auth.uid(), 'finance-admin'::app_role));
CREATE POLICY "Issuer or admin deletes draft invoices" ON public.invoices FOR DELETE
  USING ((issuer_id = auth.uid() AND status = 'draft') OR public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_invoices_issuer ON public.invoices(issuer_id, created_at DESC);
CREATE INDEX idx_invoices_recipient ON public.invoices(recipient_id, created_at DESC);
CREATE INDEX idx_invoices_status ON public.invoices(status, due_at);
CREATE INDEX idx_invoices_order ON public.invoices(order_id);

CREATE TRIGGER trg_invoices_touch BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 3. payments (charge attempts)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.payments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  invoice_id      uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  payer_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  payee_id        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  provider        text NOT NULL CHECK (provider IN ('stripe','paddle','manual','credit','wallet')),
  provider_ref    text,                                -- e.g. Stripe charge id
  amount_cents    integer NOT NULL CHECK (amount_cents >= 0),
  fee_cents       integer NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  refunded_cents  integer NOT NULL DEFAULT 0 CHECK (refunded_cents >= 0),
  currency        text NOT NULL DEFAULT 'USD',
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','succeeded','failed','refunded','partially_refunded','cancelled')),
  failure_reason  text,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  processed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payments visible to participants" ON public.payments FOR SELECT
  USING (
    auth.uid() IN (payer_id, payee_id)
    OR public.has_role(auth.uid(), 'finance-admin'::app_role)
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
  );
CREATE POLICY "Payer inserts payment" ON public.payments FOR INSERT TO authenticated
  WITH CHECK (payer_id = auth.uid());
CREATE POLICY "Finance admins update payments" ON public.payments FOR UPDATE
  USING (public.has_role(auth.uid(), 'finance-admin'::app_role) OR public.has_role(auth.uid(), 'super-admin'::app_role));
CREATE POLICY "Super admins delete payments" ON public.payments FOR DELETE
  USING (public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_payments_payer ON public.payments(payer_id, created_at DESC);
CREATE INDEX idx_payments_payee ON public.payments(payee_id, created_at DESC);
CREATE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_invoice ON public.payments(invoice_id);
CREATE INDEX idx_payments_provider_ref ON public.payments(provider, provider_ref);

CREATE TRIGGER trg_payments_touch BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 4. payouts (outbound to sellers)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.payouts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payee_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  organization_id text REFERENCES public.organizations(id) ON DELETE SET NULL,
  provider        text NOT NULL CHECK (provider IN ('stripe','paddle','wise','manual','wallet')),
  provider_ref    text,
  gross_cents     integer NOT NULL CHECK (gross_cents >= 0),
  fee_cents       integer NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  net_cents       integer NOT NULL CHECK (net_cents >= 0),
  currency        text NOT NULL DEFAULT 'USD',
  period_start    timestamptz,
  period_end      timestamptz,
  payout_method   text,                                  -- e.g. 'bank_transfer','card','wallet'
  status          text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','processing','paid','failed','cancelled','reversed')),
  failure_reason  text,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  scheduled_at    timestamptz,
  processed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payouts visible to payee or finance" ON public.payouts FOR SELECT
  USING (
    payee_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role))
    OR public.has_role(auth.uid(), 'finance-admin'::app_role)
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
  );
CREATE POLICY "Finance admins manage payouts" ON public.payouts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'finance-admin'::app_role) OR public.has_role(auth.uid(), 'super-admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'finance-admin'::app_role) OR public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_payouts_payee ON public.payouts(payee_id, created_at DESC);
CREATE INDEX idx_payouts_status ON public.payouts(status, scheduled_at);
CREATE INDEX idx_payouts_provider_ref ON public.payouts(provider, provider_ref);

CREATE TRIGGER trg_payouts_touch BEFORE UPDATE ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();