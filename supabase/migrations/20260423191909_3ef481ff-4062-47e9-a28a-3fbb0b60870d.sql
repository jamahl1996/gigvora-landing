-- Phase 7.3 — Work Execution schema
-- Tables: tasks, milestones, deliverables, time_entries
-- Linked to projects(id); RLS scopes access via project ownership / org membership.

-- Helper: can the current user access the given project?
CREATE OR REPLACE FUNCTION public.can_access_project(_project_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = _project_id
      AND (
        p.owner_id = auth.uid()
        OR (p.organization_id IS NOT NULL AND public.is_org_member(auth.uid(), p.organization_id, 'member'::org_member_role))
        OR public.has_role(auth.uid(), 'super-admin'::app_role)
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_project(_project_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = _project_id
      AND (
        p.owner_id = auth.uid()
        OR (p.organization_id IS NOT NULL AND public.is_org_member(auth.uid(), p.organization_id, 'admin'::org_member_role))
        OR public.has_role(auth.uid(), 'super-admin'::app_role)
      )
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- 1. tasks
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.tasks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  parent_id       uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_by      uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  assignee_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title           text NOT NULL CHECK (length(title) BETWEEN 1 AND 300),
  description     text NOT NULL DEFAULT '',
  status          text NOT NULL DEFAULT 'todo' CHECK (status IN ('backlog','todo','in_progress','blocked','in_review','done','cancelled')),
  priority        text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  estimate_hours  numeric(8,2) CHECK (estimate_hours IS NULL OR estimate_hours >= 0),
  position        integer NOT NULL DEFAULT 0,
  due_at          timestamptz,
  completed_at    timestamptz,
  tags            text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasks viewable by project access or assignee" ON public.tasks FOR SELECT
  USING (assignee_id = auth.uid() OR created_by = auth.uid() OR public.can_access_project(project_id));
CREATE POLICY "Tasks insert by project access" ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND public.can_access_project(project_id));
CREATE POLICY "Tasks update by manager or assignee" ON public.tasks FOR UPDATE
  USING (assignee_id = auth.uid() OR public.can_manage_project(project_id));
CREATE POLICY "Tasks delete by project manager" ON public.tasks FOR DELETE
  USING (public.can_manage_project(project_id));

CREATE INDEX idx_tasks_project ON public.tasks(project_id, status, position);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id, status);
CREATE INDEX idx_tasks_due ON public.tasks(due_at) WHERE due_at IS NOT NULL;

CREATE TRIGGER trg_tasks_touch BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 2. milestones
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.milestones (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title           text NOT NULL CHECK (length(title) BETWEEN 1 AND 300),
  description     text NOT NULL DEFAULT '',
  amount_cents    integer CHECK (amount_cents IS NULL OR amount_cents >= 0),
  currency        text NOT NULL DEFAULT 'USD',
  status          text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','active','submitted','approved','paid','cancelled')),
  position        integer NOT NULL DEFAULT 0,
  due_at          timestamptz,
  approved_at     timestamptz,
  paid_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Milestones viewable by project access" ON public.milestones FOR SELECT
  USING (public.can_access_project(project_id));
CREATE POLICY "Milestones insert by project manager" ON public.milestones FOR INSERT TO authenticated
  WITH CHECK (public.can_manage_project(project_id));
CREATE POLICY "Milestones update by project manager" ON public.milestones FOR UPDATE
  USING (public.can_manage_project(project_id));
CREATE POLICY "Milestones delete by project manager" ON public.milestones FOR DELETE
  USING (public.can_manage_project(project_id));

CREATE INDEX idx_milestones_project ON public.milestones(project_id, position);
CREATE INDEX idx_milestones_status ON public.milestones(status, due_at);

CREATE TRIGGER trg_milestones_touch BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 3. deliverables
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.deliverables (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  milestone_id    uuid REFERENCES public.milestones(id) ON DELETE SET NULL,
  task_id         uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  submitted_by    uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  title           text NOT NULL CHECK (length(title) BETWEEN 1 AND 300),
  notes           text NOT NULL DEFAULT '',
  files           jsonb NOT NULL DEFAULT '[]'::jsonb, -- [{url,name,size,mime}]
  links           jsonb NOT NULL DEFAULT '[]'::jsonb,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','changes_requested','rejected')),
  reviewer_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at     timestamptz,
  review_notes    text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deliverables viewable by project access" ON public.deliverables FOR SELECT
  USING (submitted_by = auth.uid() OR public.can_access_project(project_id));
CREATE POLICY "Deliverables insert by project access" ON public.deliverables FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND public.can_access_project(project_id));
CREATE POLICY "Deliverables update by submitter or manager" ON public.deliverables FOR UPDATE
  USING (submitted_by = auth.uid() OR public.can_manage_project(project_id));
CREATE POLICY "Deliverables delete by submitter or manager" ON public.deliverables FOR DELETE
  USING (submitted_by = auth.uid() OR public.can_manage_project(project_id));

CREATE INDEX idx_deliverables_project ON public.deliverables(project_id, created_at DESC);
CREATE INDEX idx_deliverables_milestone ON public.deliverables(milestone_id);
CREATE INDEX idx_deliverables_status ON public.deliverables(status);

CREATE TRIGGER trg_deliverables_touch BEFORE UPDATE ON public.deliverables
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 4. time_entries
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.time_entries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id         uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  description     text NOT NULL DEFAULT '',
  started_at      timestamptz NOT NULL,
  ended_at        timestamptz,
  duration_seconds integer CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  billable        boolean NOT NULL DEFAULT false,
  hourly_rate_cents integer CHECK (hourly_rate_cents IS NULL OR hourly_rate_cents >= 0),
  currency        text NOT NULL DEFAULT 'USD',
  invoice_id      uuid,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Time entries viewable by author or project manager" ON public.time_entries FOR SELECT
  USING (user_id = auth.uid() OR public.can_manage_project(project_id));
CREATE POLICY "Time entries insert by self with project access" ON public.time_entries FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.can_access_project(project_id));
CREATE POLICY "Time entries update by author" ON public.time_entries FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "Time entries delete by author or project manager" ON public.time_entries FOR DELETE
  USING (user_id = auth.uid() OR public.can_manage_project(project_id));

CREATE INDEX idx_time_entries_user ON public.time_entries(user_id, started_at DESC);
CREATE INDEX idx_time_entries_project ON public.time_entries(project_id, started_at DESC);
CREATE INDEX idx_time_entries_task ON public.time_entries(task_id);

CREATE TRIGGER trg_time_entries_touch BEFORE UPDATE ON public.time_entries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();