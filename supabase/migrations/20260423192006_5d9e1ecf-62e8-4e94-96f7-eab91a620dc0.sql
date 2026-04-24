-- Phase 7.4 — Recruitment & Hiring schema
-- Tables: candidates, applications, interviews, scorecards
-- RECRUITER-PRIVATE per mem://features/privacy-and-trust

-- ─────────────────────────────────────────────────────────────────────────
-- 1. candidates
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.candidates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id text REFERENCES public.organizations(id) ON DELETE SET NULL,
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- linked profile if matched
  full_name       text NOT NULL,
  email           text,
  phone           text,
  current_title   text,
  current_company text,
  location        text,
  source          text,                      -- e.g. 'linkedin','referral','inbound','sourced'
  stage           text NOT NULL DEFAULT 'sourced' CHECK (stage IN ('sourced','contacted','screening','interview','offer','hired','rejected','archived')),
  tags            text[] NOT NULL DEFAULT ARRAY[]::text[],
  notes           text NOT NULL DEFAULT '',
  resume_url      text,
  links           jsonb NOT NULL DEFAULT '[]'::jsonb,
  rating          integer CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiter sees own candidates" ON public.candidates FOR SELECT
  USING (
    recruiter_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role))
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
  );
CREATE POLICY "Recruiter inserts candidates" ON public.candidates FOR INSERT TO authenticated
  WITH CHECK (recruiter_id = auth.uid());
CREATE POLICY "Recruiter updates own candidates" ON public.candidates FOR UPDATE
  USING (recruiter_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role)));
CREATE POLICY "Recruiter deletes own candidates" ON public.candidates FOR DELETE
  USING (recruiter_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role)));

CREATE INDEX idx_candidates_recruiter ON public.candidates(recruiter_id, stage);
CREATE INDEX idx_candidates_org ON public.candidates(organization_id);
CREATE INDEX idx_candidates_tags ON public.candidates USING GIN(tags);

CREATE TRIGGER trg_candidates_touch BEFORE UPDATE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 2. applications
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.applications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id    uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  job_id          uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  project_id      uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  recruiter_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id text REFERENCES public.organizations(id) ON DELETE SET NULL,
  stage           text NOT NULL DEFAULT 'applied' CHECK (stage IN ('applied','screening','interview','offer','hired','rejected','withdrawn')),
  source          text,
  score           numeric(4,2),
  cover_note      text,
  attachments     jsonb NOT NULL DEFAULT '[]'::jsonb,
  applied_at      timestamptz NOT NULL DEFAULT now(),
  decided_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (job_id IS NOT NULL OR project_id IS NOT NULL)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiter sees own applications" ON public.applications FOR SELECT
  USING (
    recruiter_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role))
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
  );
CREATE POLICY "Recruiter inserts applications" ON public.applications FOR INSERT TO authenticated
  WITH CHECK (recruiter_id = auth.uid());
CREATE POLICY "Recruiter updates own applications" ON public.applications FOR UPDATE
  USING (recruiter_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role)));
CREATE POLICY "Recruiter deletes own applications" ON public.applications FOR DELETE
  USING (recruiter_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role)));

CREATE INDEX idx_applications_candidate ON public.applications(candidate_id);
CREATE INDEX idx_applications_recruiter ON public.applications(recruiter_id, stage);
CREATE INDEX idx_applications_job ON public.applications(job_id);
CREATE INDEX idx_applications_project ON public.applications(project_id);

CREATE TRIGGER trg_applications_touch BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 3. interviews
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.interviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  recruiter_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id text REFERENCES public.organizations(id) ON DELETE SET NULL,
  kind            text NOT NULL DEFAULT 'video' CHECK (kind IN ('phone','video','onsite','technical','panel','async')),
  scheduled_at    timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30 CHECK (duration_minutes > 0),
  panelist_ids    uuid[] NOT NULL DEFAULT ARRAY[]::uuid[],
  location        text,
  meeting_url     text,
  status          text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled','no_show','rescheduled')),
  agenda          text NOT NULL DEFAULT '',
  recording_url   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiter or panelist sees interview" ON public.interviews FOR SELECT
  USING (
    recruiter_id = auth.uid()
    OR auth.uid() = ANY(panelist_ids)
    OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role))
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
  );
CREATE POLICY "Recruiter inserts interview" ON public.interviews FOR INSERT TO authenticated
  WITH CHECK (recruiter_id = auth.uid());
CREATE POLICY "Recruiter updates interview" ON public.interviews FOR UPDATE
  USING (recruiter_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role)));
CREATE POLICY "Recruiter deletes interview" ON public.interviews FOR DELETE
  USING (recruiter_id = auth.uid() OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role)));

CREATE INDEX idx_interviews_application ON public.interviews(application_id);
CREATE INDEX idx_interviews_recruiter ON public.interviews(recruiter_id, scheduled_at);
CREATE INDEX idx_interviews_panelists ON public.interviews USING GIN(panelist_ids);

CREATE TRIGGER trg_interviews_touch BEFORE UPDATE ON public.interviews
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 4. scorecards
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.scorecards (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id    uuid NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  application_id  uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  reviewer_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recruiter_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id text REFERENCES public.organizations(id) ON DELETE SET NULL,
  overall_rating  integer NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  competencies    jsonb NOT NULL DEFAULT '{}'::jsonb,  -- {"communication":4,"technical":5}
  strengths       text NOT NULL DEFAULT '',
  concerns        text NOT NULL DEFAULT '',
  notes           text NOT NULL DEFAULT '',
  recommendation  text NOT NULL CHECK (recommendation IN ('strong_yes','yes','no','strong_no')),
  submitted_at    timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.scorecards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviewer or recruiter sees scorecard" ON public.scorecards FOR SELECT
  USING (
    reviewer_id = auth.uid()
    OR recruiter_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id, 'admin'::org_member_role))
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
  );
CREATE POLICY "Reviewer inserts scorecard" ON public.scorecards FOR INSERT TO authenticated
  WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "Reviewer updates own scorecard" ON public.scorecards FOR UPDATE
  USING (reviewer_id = auth.uid());
CREATE POLICY "Reviewer or recruiter deletes scorecard" ON public.scorecards FOR DELETE
  USING (reviewer_id = auth.uid() OR recruiter_id = auth.uid());

CREATE INDEX idx_scorecards_interview ON public.scorecards(interview_id);
CREATE INDEX idx_scorecards_application ON public.scorecards(application_id);
CREATE INDEX idx_scorecards_reviewer ON public.scorecards(reviewer_id);

CREATE TRIGGER trg_scorecards_touch BEFORE UPDATE ON public.scorecards
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();