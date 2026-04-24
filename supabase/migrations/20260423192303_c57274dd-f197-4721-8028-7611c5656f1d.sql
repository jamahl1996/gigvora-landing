-- Phase 7.7 — Media, Reviews & Trust schema
-- Tables: media_assets, reviews, disputes, audit_logs

-- ─────────────────────────────────────────────────────────────────────────
-- 1. media_assets
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.media_assets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind            text NOT NULL CHECK (kind IN ('image','video','audio','document','other')),
  storage_bucket  text NOT NULL DEFAULT 'media',
  storage_path    text NOT NULL,
  url             text,
  mime_type       text,
  size_bytes      bigint CHECK (size_bytes IS NULL OR size_bytes >= 0),
  width           integer,
  height          integer,
  duration_seconds integer,
  thumbnail_url   text,
  alt_text        text,
  visibility      text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','connections','private')),
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media visibility rules" ON public.media_assets FOR SELECT
  USING (
    visibility = 'public'
    OR owner_id = auth.uid()
    OR (visibility = 'connections' AND auth.uid() IS NOT NULL AND public.are_connected(owner_id, auth.uid()))
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
    OR public.has_role(auth.uid(), 'moderator'::app_role)
  );
CREATE POLICY "Owner inserts media" ON public.media_assets FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner updates media" ON public.media_assets FOR UPDATE
  USING (owner_id = auth.uid());
CREATE POLICY "Owner or moderator deletes media" ON public.media_assets FOR DELETE
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'moderator'::app_role) OR public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_media_owner ON public.media_assets(owner_id, created_at DESC);
CREATE INDEX idx_media_kind ON public.media_assets(kind);

CREATE TRIGGER trg_media_touch BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 2. reviews (buyer reviews seller after completed order)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.reviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  reviewer_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gig_id          uuid REFERENCES public.gigs(id) ON DELETE SET NULL,
  service_id      uuid REFERENCES public.services(id) ON DELETE SET NULL,
  project_id      uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  overall_rating  integer NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  communication_rating integer CHECK (communication_rating IS NULL OR communication_rating BETWEEN 1 AND 5),
  quality_rating  integer CHECK (quality_rating IS NULL OR quality_rating BETWEEN 1 AND 5),
  expertise_rating integer CHECK (expertise_rating IS NULL OR expertise_rating BETWEEN 1 AND 5),
  value_rating    integer CHECK (value_rating IS NULL OR value_rating BETWEEN 1 AND 5),
  comment         text NOT NULL DEFAULT '',
  response        text,                                         -- seller's reply
  responded_at    timestamptz,
  moderation_status text NOT NULL DEFAULT 'visible' CHECK (moderation_status IN ('visible','flagged','hidden','removed')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (reviewer_id <> reviewee_id),
  UNIQUE (order_id, reviewer_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews visible publicly when moderated visible" ON public.reviews FOR SELECT
  USING (
    moderation_status = 'visible'
    OR auth.uid() IN (reviewer_id, reviewee_id)
    OR public.has_role(auth.uid(), 'moderator'::app_role)
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
  );
CREATE POLICY "Reviewer creates review" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "Reviewer updates own review; reviewee posts response" ON public.reviews FOR UPDATE
  USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid() OR public.has_role(auth.uid(), 'moderator'::app_role));
CREATE POLICY "Reviewer or moderator deletes review" ON public.reviews FOR DELETE
  USING (reviewer_id = auth.uid() OR public.has_role(auth.uid(), 'moderator'::app_role) OR public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_reviews_reviewee ON public.reviews(reviewee_id, created_at DESC);
CREATE INDEX idx_reviews_reviewer ON public.reviews(reviewer_id, created_at DESC);
CREATE INDEX idx_reviews_gig ON public.reviews(gig_id);
CREATE INDEX idx_reviews_service ON public.reviews(service_id);

CREATE TRIGGER trg_reviews_touch BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 3. disputes
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.disputes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number     text UNIQUE NOT NULL DEFAULT ('CASE-' || to_char(now(),'YYYYMMDD') || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  order_id        uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  raised_by       uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  respondent_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  assigned_to     uuid REFERENCES auth.users(id) ON DELETE SET NULL,         -- dispute-mgr
  reason          text NOT NULL,
  narrative       text NOT NULL DEFAULT '',
  evidence        jsonb NOT NULL DEFAULT '[]'::jsonb,
  amount_disputed_cents integer CHECK (amount_disputed_cents IS NULL OR amount_disputed_cents >= 0),
  currency        text NOT NULL DEFAULT 'USD',
  status          text NOT NULL DEFAULT 'open' CHECK (status IN ('open','under_review','awaiting_response','resolved','cancelled')),
  outcome         text CHECK (outcome IS NULL OR outcome IN ('refund_full','refund_partial','release_to_seller','split','no_action','other')),
  outcome_notes   text,
  resolved_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (raised_by <> respondent_id)
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disputes visible to participants and admins" ON public.disputes FOR SELECT
  USING (
    auth.uid() IN (raised_by, respondent_id, assigned_to)
    OR public.has_role(auth.uid(), 'dispute-mgr'::app_role)
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
    OR public.has_role(auth.uid(), 'trust-safety'::app_role)
  );
CREATE POLICY "Participants raise disputes" ON public.disputes FOR INSERT TO authenticated
  WITH CHECK (raised_by = auth.uid());
CREATE POLICY "Participants and dispute mgr update" ON public.disputes FOR UPDATE
  USING (
    auth.uid() IN (raised_by, respondent_id, assigned_to)
    OR public.has_role(auth.uid(), 'dispute-mgr'::app_role)
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
  );
CREATE POLICY "Super admins delete disputes" ON public.disputes FOR DELETE
  USING (public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_disputes_raised_by ON public.disputes(raised_by);
CREATE INDEX idx_disputes_respondent ON public.disputes(respondent_id);
CREATE INDEX idx_disputes_assigned ON public.disputes(assigned_to);
CREATE INDEX idx_disputes_status ON public.disputes(status, created_at DESC);
CREATE INDEX idx_disputes_order ON public.disputes(order_id);

CREATE TRIGGER trg_disputes_touch BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 4. audit_logs (append-only)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.audit_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role      text,
  action          text NOT NULL,
  target_table    text,
  target_id       text,
  before_data     jsonb,
  after_data      jsonb,
  ip_address      inet,
  user_agent      text,
  reason          text,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Read: super-admin, compliance, trust-safety
CREATE POLICY "Audit logs visible to compliance roles" ON public.audit_logs FOR SELECT
  USING (
    public.has_role(auth.uid(), 'super-admin'::app_role)
    OR public.has_role(auth.uid(), 'compliance'::app_role)
    OR public.has_role(auth.uid(), 'trust-safety'::app_role)
  );

-- Insert: any authenticated user (server-side audit emitters); actor_id must match auth.uid() when provided
CREATE POLICY "Authenticated users emit audit logs" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_id IS NULL OR actor_id = auth.uid());

-- NO update or delete policies — append-only by design.

CREATE INDEX idx_audit_actor ON public.audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_action ON public.audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_target ON public.audit_logs(target_table, target_id);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);