-- =========================================================================
-- Phase 9.1 — Backfill the remaining 8 domain tables
-- =========================================================================

-- ----- PROPOSALS -----
CREATE TABLE IF NOT EXISTS public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  freelancer_id uuid NOT NULL,
  organization_id text,
  cover_note text NOT NULL DEFAULT '',
  bid_amount_cents integer,
  currency text NOT NULL DEFAULT 'USD',
  timeline_days integer,
  status text NOT NULL DEFAULT 'submitted',  -- submitted|shortlisted|withdrawn|accepted|rejected
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, freelancer_id)
);
CREATE INDEX IF NOT EXISTS proposals_project_idx ON public.proposals(project_id);
CREATE INDEX IF NOT EXISTS proposals_freelancer_idx ON public.proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS proposals_status_idx ON public.proposals(status);
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancer reads own proposals"
  ON public.proposals FOR SELECT USING (freelancer_id = auth.uid() OR public.can_manage_project(project_id) OR public.has_role(auth.uid(),'super-admin'::app_role));
CREATE POLICY "Freelancer creates own proposal"
  ON public.proposals FOR INSERT TO authenticated WITH CHECK (freelancer_id = auth.uid());
CREATE POLICY "Freelancer updates own proposal"
  ON public.proposals FOR UPDATE USING (freelancer_id = auth.uid() OR public.can_manage_project(project_id));
CREATE POLICY "Freelancer or owner deletes proposal"
  ON public.proposals FOR DELETE USING (freelancer_id = auth.uid() OR public.can_manage_project(project_id));
CREATE TRIGGER proposals_touch BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ----- CONTRACTS / SOW -----
CREATE TABLE IF NOT EXISTS public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid,
  proposal_id uuid,
  client_id uuid NOT NULL,
  provider_id uuid NOT NULL,
  organization_id text,
  title text NOT NULL,
  scope text NOT NULL DEFAULT '',
  total_amount_cents integer,
  currency text NOT NULL DEFAULT 'USD',
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'draft', -- draft|sent|signed|active|completed|cancelled
  client_signed_at timestamptz,
  provider_signed_at timestamptz,
  terms jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contracts_client_idx ON public.contracts(client_id);
CREATE INDEX IF NOT EXISTS contracts_provider_idx ON public.contracts(provider_id);
CREATE INDEX IF NOT EXISTS contracts_project_idx ON public.contracts(project_id);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contracts visible to participants"
  ON public.contracts FOR SELECT USING (auth.uid() IN (client_id, provider_id) OR public.has_role(auth.uid(),'super-admin'::app_role));
CREATE POLICY "Client or provider creates contract"
  ON public.contracts FOR INSERT TO authenticated WITH CHECK (auth.uid() IN (client_id, provider_id));
CREATE POLICY "Participants update contract"
  ON public.contracts FOR UPDATE USING (auth.uid() IN (client_id, provider_id));
CREATE POLICY "Client deletes draft contract"
  ON public.contracts FOR DELETE USING (auth.uid() = client_id AND status = 'draft');
CREATE TRIGGER contracts_touch BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ----- GROUPS -----
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  slug text UNIQUE,
  description text NOT NULL DEFAULT '',
  visibility text NOT NULL DEFAULT 'public', -- public|private|secret
  cover_image_url text,
  member_count integer NOT NULL DEFAULT 0,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS groups_visibility_idx ON public.groups(visibility);
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public groups readable by all"
  ON public.groups FOR SELECT USING (visibility IN ('public','private') OR owner_id = auth.uid());
CREATE POLICY "Owner creates group"
  ON public.groups FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner updates group"
  ON public.groups FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owner deletes group"
  ON public.groups FOR DELETE USING (owner_id = auth.uid());
CREATE TRIGGER groups_touch BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ----- GROUP MEMBERS -----
CREATE TABLE IF NOT EXISTS public.group_members (
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member', -- owner|admin|moderator|member
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS group_members_user_idx ON public.group_members(user_id);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members see group membership"
  ON public.group_members FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND (g.visibility = 'public' OR g.owner_id = auth.uid()))
  );
CREATE POLICY "User joins group"
  ON public.group_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "User leaves group"
  ON public.group_members FOR DELETE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.owner_id = auth.uid()));

-- ----- WEBINARS -----
CREATE TABLE IF NOT EXISTS public.webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL,
  organization_id text,
  title text NOT NULL,
  slug text,
  description text NOT NULL DEFAULT '',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  capacity integer,
  attendee_count integer NOT NULL DEFAULT 0,
  meeting_url text,
  cover_image_url text,
  status text NOT NULL DEFAULT 'scheduled', -- scheduled|live|completed|cancelled
  visibility text NOT NULL DEFAULT 'public',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS webinars_starts_idx ON public.webinars(starts_at);
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public webinars readable"
  ON public.webinars FOR SELECT USING (visibility = 'public' OR host_id = auth.uid());
CREATE POLICY "Host creates webinar"
  ON public.webinars FOR INSERT TO authenticated WITH CHECK (host_id = auth.uid());
CREATE POLICY "Host updates webinar"
  ON public.webinars FOR UPDATE USING (host_id = auth.uid());
CREATE POLICY "Host deletes webinar"
  ON public.webinars FOR DELETE USING (host_id = auth.uid());
CREATE TRIGGER webinars_touch BEFORE UPDATE ON public.webinars FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ----- CALLS -----
CREATE TABLE IF NOT EXISTS public.calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_id uuid NOT NULL,
  participant_ids uuid[] NOT NULL,
  kind text NOT NULL DEFAULT 'video', -- audio|video
  status text NOT NULL DEFAULT 'ringing', -- ringing|active|ended|missed
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer,
  recording_url text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS calls_initiator_idx ON public.calls(initiator_id);
CREATE INDEX IF NOT EXISTS calls_participants_idx ON public.calls USING GIN(participant_ids);
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants read calls"
  ON public.calls FOR SELECT USING (auth.uid() = initiator_id OR auth.uid() = ANY(participant_ids));
CREATE POLICY "Initiator creates call"
  ON public.calls FOR INSERT TO authenticated WITH CHECK (initiator_id = auth.uid());
CREATE POLICY "Participants update call"
  ON public.calls FOR UPDATE USING (auth.uid() = initiator_id OR auth.uid() = ANY(participant_ids));

-- ----- WEBHOOKS -----
CREATE TABLE IF NOT EXISTS public.webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  organization_id text,
  url text NOT NULL,
  secret text NOT NULL,
  event_types text[] NOT NULL DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  last_triggered_at timestamptz,
  failure_count integer NOT NULL DEFAULT 0,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS webhooks_owner_idx ON public.webhooks(owner_id);
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner reads webhooks"
  ON public.webhooks FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Owner creates webhook"
  ON public.webhooks FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner updates webhook"
  ON public.webhooks FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owner deletes webhook"
  ON public.webhooks FOR DELETE USING (owner_id = auth.uid());
CREATE TRIGGER webhooks_touch BEFORE UPDATE ON public.webhooks FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ----- EVENTS (community / calendar) -----
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL,
  organization_id text,
  group_id uuid REFERENCES public.groups(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  location text,
  online_url text,
  capacity integer,
  attendee_count integer NOT NULL DEFAULT 0,
  visibility text NOT NULL DEFAULT 'public',
  status text NOT NULL DEFAULT 'scheduled',
  cover_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_starts_idx ON public.events(starts_at);
CREATE INDEX IF NOT EXISTS events_host_idx ON public.events(host_id);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public events readable"
  ON public.events FOR SELECT USING (visibility = 'public' OR host_id = auth.uid());
CREATE POLICY "Host creates event"
  ON public.events FOR INSERT TO authenticated WITH CHECK (host_id = auth.uid());
CREATE POLICY "Host updates event"
  ON public.events FOR UPDATE USING (host_id = auth.uid());
CREATE POLICY "Host deletes event"
  ON public.events FOR DELETE USING (host_id = auth.uid());
CREATE TRIGGER events_touch BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ----- MENTORSHIP RELATIONSHIPS -----
CREATE TABLE IF NOT EXISTS public.mentorship_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL,
  mentee_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending|active|paused|ended
  goals text NOT NULL DEFAULT '',
  cadence text, -- weekly|biweekly|monthly|adhoc
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (mentor_id, mentee_id)
);
CREATE INDEX IF NOT EXISTS mentorship_mentor_idx ON public.mentorship_relationships(mentor_id);
CREATE INDEX IF NOT EXISTS mentorship_mentee_idx ON public.mentorship_relationships(mentee_id);
ALTER TABLE public.mentorship_relationships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants read mentorship"
  ON public.mentorship_relationships FOR SELECT USING (auth.uid() IN (mentor_id, mentee_id));
CREATE POLICY "Mentee requests mentorship"
  ON public.mentorship_relationships FOR INSERT TO authenticated WITH CHECK (mentee_id = auth.uid());
CREATE POLICY "Participants update mentorship"
  ON public.mentorship_relationships FOR UPDATE USING (auth.uid() IN (mentor_id, mentee_id));
CREATE POLICY "Participants delete mentorship"
  ON public.mentorship_relationships FOR DELETE USING (auth.uid() IN (mentor_id, mentee_id));
CREATE TRIGGER mentorship_touch BEFORE UPDATE ON public.mentorship_relationships FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================================
-- Notification fan-out helper (B-044) — SECURITY DEFINER so users can
-- create notifications addressed to OTHER users (e.g. "X commented on
-- your post"). Caller still goes through DB-side trust: function only
-- inserts notifications when the actor is auth.uid() (prevents spoofing).
-- =========================================================================
CREATE OR REPLACE FUNCTION public.send_notification(
  _user_id uuid,
  _kind text,
  _title text,
  _body text DEFAULT NULL,
  _link_url text DEFAULT NULL,
  _payload jsonb DEFAULT '{}'::jsonb,
  _source_kind text DEFAULT NULL,
  _source_id text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_actor uuid := auth.uid();
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'auth required to send notifications';
  END IF;
  -- Don't spam yourself
  IF _user_id = v_actor THEN
    RETURN NULL;
  END IF;
  INSERT INTO public.notifications(user_id, actor_id, kind, title, body, link_url, payload, source_kind, source_id)
  VALUES (_user_id, v_actor, _kind, _title, _body, _link_url, coalesce(_payload,'{}'::jsonb), _source_kind, _source_id)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.send_notification(uuid, text, text, text, text, jsonb, text, text) TO authenticated;