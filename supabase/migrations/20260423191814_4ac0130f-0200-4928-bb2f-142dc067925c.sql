-- Phase 7.2 — Commercial Marketplace schema
-- Tables: jobs, gigs, services, projects
-- Pattern: owner-write, public-read for published rows, super-admin manage all.

-- ─────────────────────────────────────────────────────────────────────────
-- 1. jobs (full-time / part-time / contract postings)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.jobs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id text REFERENCES public.organizations(id) ON DELETE SET NULL,
  title           text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  slug            text UNIQUE,
  description     text NOT NULL DEFAULT '',
  employment_type text NOT NULL DEFAULT 'full_time' CHECK (employment_type IN ('full_time','part_time','contract','internship','temporary')),
  location        text,
  remote_policy   text NOT NULL DEFAULT 'onsite' CHECK (remote_policy IN ('onsite','hybrid','remote')),
  salary_min_cents integer CHECK (salary_min_cents IS NULL OR salary_min_cents >= 0),
  salary_max_cents integer CHECK (salary_max_cents IS NULL OR salary_max_cents >= 0),
  currency        text NOT NULL DEFAULT 'USD',
  skills          text[] NOT NULL DEFAULT ARRAY[]::text[],
  category        text,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','closed','archived')),
  published_at    timestamptz,
  closes_at       timestamptz,
  applicant_count integer NOT NULL DEFAULT 0,
  view_count      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published jobs viewable by everyone" ON public.jobs FOR SELECT
  USING (status = 'published' OR owner_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'member'::org_member_role)));
CREATE POLICY "Owners insert jobs" ON public.jobs FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners update own jobs" ON public.jobs FOR UPDATE
  USING (owner_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role)));
CREATE POLICY "Owners delete own jobs" ON public.jobs FOR DELETE
  USING (owner_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role)));
CREATE POLICY "Super admins manage jobs" ON public.jobs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super-admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_jobs_status_published ON public.jobs(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_jobs_owner ON public.jobs(owner_id);
CREATE INDEX idx_jobs_org ON public.jobs(organization_id);
CREATE INDEX idx_jobs_skills ON public.jobs USING GIN(skills);

CREATE TRIGGER trg_jobs_touch BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 2. gigs (productized fixed-tier offerings)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.gigs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  slug            text UNIQUE,
  description     text NOT NULL DEFAULT '',
  category        text,
  tags            text[] NOT NULL DEFAULT ARRAY[]::text[],
  cover_image_url text,
  gallery         jsonb NOT NULL DEFAULT '[]'::jsonb,
  tiers           jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{name,price_cents,delivery_days,revisions,features[]}]
  currency        text NOT NULL DEFAULT 'USD',
  starting_price_cents integer CHECK (starting_price_cents IS NULL OR starting_price_cents >= 0),
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','paused','archived')),
  published_at    timestamptz,
  rating_avg      numeric(3,2),
  rating_count    integer NOT NULL DEFAULT 0,
  order_count     integer NOT NULL DEFAULT 0,
  view_count      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published gigs viewable by everyone" ON public.gigs FOR SELECT
  USING (status = 'published' OR owner_id = auth.uid());
CREATE POLICY "Owners insert gigs" ON public.gigs FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners update own gigs" ON public.gigs FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owners delete own gigs" ON public.gigs FOR DELETE USING (owner_id = auth.uid());
CREATE POLICY "Super admins manage gigs" ON public.gigs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super-admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_gigs_status_published ON public.gigs(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_gigs_owner ON public.gigs(owner_id);
CREATE INDEX idx_gigs_tags ON public.gigs USING GIN(tags);

CREATE TRIGGER trg_gigs_touch BEFORE UPDATE ON public.gigs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 3. services (consultative / hourly / retainer offerings)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.services (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  slug            text UNIQUE,
  summary         text NOT NULL DEFAULT '',
  description     text NOT NULL DEFAULT '',
  category        text,
  tags            text[] NOT NULL DEFAULT ARRAY[]::text[],
  pricing_model   text NOT NULL DEFAULT 'hourly' CHECK (pricing_model IN ('hourly','retainer','project','custom')),
  hourly_rate_cents integer CHECK (hourly_rate_cents IS NULL OR hourly_rate_cents >= 0),
  retainer_cents  integer CHECK (retainer_cents IS NULL OR retainer_cents >= 0),
  currency        text NOT NULL DEFAULT 'USD',
  cover_image_url text,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','paused','archived')),
  published_at    timestamptz,
  rating_avg      numeric(3,2),
  rating_count    integer NOT NULL DEFAULT 0,
  inquiry_count   integer NOT NULL DEFAULT 0,
  view_count      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published services viewable by everyone" ON public.services FOR SELECT
  USING (status = 'published' OR owner_id = auth.uid());
CREATE POLICY "Owners insert services" ON public.services FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners update own services" ON public.services FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owners delete own services" ON public.services FOR DELETE USING (owner_id = auth.uid());
CREATE POLICY "Super admins manage services" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super-admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_services_status_published ON public.services(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_services_owner ON public.services(owner_id);
CREATE INDEX idx_services_tags ON public.services USING GIN(tags);

CREATE TRIGGER trg_services_touch BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 4. projects (client-posted briefs that providers bid/propose on)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.projects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id text REFERENCES public.organizations(id) ON DELETE SET NULL,
  title           text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  slug            text UNIQUE,
  brief           text NOT NULL DEFAULT '',
  category        text,
  skills_required text[] NOT NULL DEFAULT ARRAY[]::text[],
  budget_min_cents integer CHECK (budget_min_cents IS NULL OR budget_min_cents >= 0),
  budget_max_cents integer CHECK (budget_max_cents IS NULL OR budget_max_cents >= 0),
  currency        text NOT NULL DEFAULT 'USD',
  budget_type     text NOT NULL DEFAULT 'fixed' CHECK (budget_type IN ('fixed','hourly','range')),
  duration        text,                                       -- e.g. '<1m','1-3m','3-6m','6m+'
  visibility      text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','invited','private')),
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','open','in_progress','completed','cancelled','archived')),
  published_at    timestamptz,
  closes_at       timestamptz,
  proposal_count  integer NOT NULL DEFAULT 0,
  view_count      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public projects viewable by everyone" ON public.projects FOR SELECT
  USING (
    (status IN ('open','in_progress','completed') AND visibility = 'public')
    OR owner_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'member'::org_member_role))
  );
CREATE POLICY "Owners insert projects" ON public.projects FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners update own projects" ON public.projects FOR UPDATE
  USING (owner_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role)));
CREATE POLICY "Owners delete own projects" ON public.projects FOR DELETE
  USING (owner_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role)));
CREATE POLICY "Super admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super-admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_projects_status ON public.projects(status, published_at DESC);
CREATE INDEX idx_projects_owner ON public.projects(owner_id);
CREATE INDEX idx_projects_org ON public.projects(organization_id);
CREATE INDEX idx_projects_skills ON public.projects USING GIN(skills_required);

CREATE TRIGGER trg_projects_touch BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();