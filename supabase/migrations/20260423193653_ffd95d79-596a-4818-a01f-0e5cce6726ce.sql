-- ============================================================================
-- Phase 7 — Core Schema Wave 1
-- Identity bootstrap trigger + legal acceptances + audit hardening
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Identity bootstrap trigger on auth.users
-- ---------------------------------------------------------------------------
-- The handle_new_user_identity() and handle_new_user_default_role() functions
-- already exist but no trigger calls them. New signups currently get no
-- profile, no user_settings row, and no default role. Fix that.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Profile + user_settings (idempotent)
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- 2. Legal acceptances
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.legal_acceptances (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL,
  document_kind   text NOT NULL CHECK (document_kind IN (
                    'terms','privacy','cookies','dpa','msa','community_guidelines'
                  )),
  document_version text NOT NULL CHECK (length(document_version) BETWEEN 1 AND 32),
  accepted_at     timestamptz NOT NULL DEFAULT now(),
  ip_address      inet,
  user_agent      text,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (user_id, document_kind, document_version)
);

CREATE INDEX IF NOT EXISTS legal_acceptances_user_idx
  ON public.legal_acceptances (user_id, document_kind, accepted_at DESC);

ALTER TABLE public.legal_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own legal acceptances"
  ON public.legal_acceptances
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'super-admin'::public.app_role)
    OR public.has_role(auth.uid(), 'compliance'::public.app_role)
  );

CREATE POLICY "Users record own legal acceptances"
  ON public.legal_acceptances
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Acceptances are append-only — no UPDATE / DELETE policies => denied.

-- ---------------------------------------------------------------------------
-- 3. Audit hardening — hash chain + append-only enforcement
-- ---------------------------------------------------------------------------
ALTER TABLE public.audit_logs
  ADD COLUMN IF NOT EXISTS prev_hash text,
  ADD COLUMN IF NOT EXISTS row_hash  text;

CREATE INDEX IF NOT EXISTS audit_logs_actor_time_idx
  ON public.audit_logs (actor_id, created_at DESC) WHERE actor_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS audit_logs_target_time_idx
  ON public.audit_logs (target_table, target_id, created_at DESC)
  WHERE target_table IS NOT NULL;

-- Hash-chain trigger: each new row's hash incorporates the previous row's hash
CREATE OR REPLACE FUNCTION public.audit_logs_hash_chain()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prev text;
BEGIN
  SELECT row_hash INTO v_prev
  FROM public.audit_logs
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  NEW.prev_hash := v_prev;
  NEW.row_hash := encode(
    digest(
      coalesce(v_prev,'') ||
      NEW.id::text ||
      coalesce(NEW.actor_id::text,'') ||
      NEW.action ||
      coalesce(NEW.target_table,'') ||
      coalesce(NEW.target_id,'') ||
      coalesce(NEW.before_data::text,'') ||
      coalesce(NEW.after_data::text,'') ||
      NEW.created_at::text,
      'sha256'
    ),
    'hex'
  );
  RETURN NEW;
END;
$$;

-- pgcrypto for digest()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TRIGGER IF EXISTS audit_logs_hash_chain_trg ON public.audit_logs;
CREATE TRIGGER audit_logs_hash_chain_trg
BEFORE INSERT ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.audit_logs_hash_chain();

-- Block UPDATE / DELETE — audit log is append-only
CREATE OR REPLACE FUNCTION public.audit_logs_block_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only — % is not permitted', TG_OP;
END;
$$;

DROP TRIGGER IF EXISTS audit_logs_no_update ON public.audit_logs;
CREATE TRIGGER audit_logs_no_update
BEFORE UPDATE OR DELETE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.audit_logs_block_mutation();

-- ---------------------------------------------------------------------------
-- 4. Canonical audit-write helper
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_audit_event(
  _action       text,
  _target_table text DEFAULT NULL,
  _target_id    text DEFAULT NULL,
  _before       jsonb DEFAULT NULL,
  _after        jsonb DEFAULT NULL,
  _reason       text DEFAULT NULL,
  _metadata     jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_actor uuid := auth.uid();
  v_role text;
BEGIN
  SELECT (current_user_roles())[1]::text INTO v_role;

  INSERT INTO public.audit_logs(
    actor_id, actor_role, action, target_table, target_id,
    before_data, after_data, reason, metadata
  )
  VALUES (
    v_actor, v_role, _action, _target_table, _target_id,
    _before, _after, _reason, coalesce(_metadata,'{}'::jsonb)
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;
