-- Domain 2: Authentication & Sessions

-- 1. Auth login attempts (5-attempt lockout)
CREATE TABLE IF NOT EXISTS public.auth_login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_auth_login_attempts_email_time ON public.auth_login_attempts (lower(email), created_at DESC);
ALTER TABLE public.auth_login_attempts ENABLE ROW LEVEL SECURITY;

-- Only admins can read; inserts are open to anon/auth (server-side throttling via app)
DROP POLICY IF EXISTS "Admins read login attempts" ON public.auth_login_attempts;
CREATE POLICY "Admins read login attempts" ON public.auth_login_attempts
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can insert login attempts" ON public.auth_login_attempts;
CREATE POLICY "Anyone can insert login attempts" ON public.auth_login_attempts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 2. Account lockouts (computed from attempts but materialised for speed)
CREATE TABLE IF NOT EXISTS public.account_lockouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  locked_until TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL DEFAULT 'too_many_attempts',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.account_lockouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage lockouts" ON public.account_lockouts;
CREATE POLICY "Admins manage lockouts" ON public.account_lockouts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can read lockout status" ON public.account_lockouts;
CREATE POLICY "Anyone can read lockout status" ON public.account_lockouts
  FOR SELECT TO anon, authenticated USING (true);

-- 3. Device sessions (logical view of user's active devices)
CREATE TABLE IF NOT EXISTS public.device_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token_hash TEXT,
  device_name TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  city TEXT,
  country TEXT,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_device_sessions_user ON public.device_sessions (user_id, last_active_at DESC);
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own sessions" ON public.device_sessions;
CREATE POLICY "Users view own sessions" ON public.device_sessions
  FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users insert own sessions" ON public.device_sessions;
CREATE POLICY "Users insert own sessions" ON public.device_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users revoke own sessions" ON public.device_sessions;
CREATE POLICY "Users revoke own sessions" ON public.device_sessions
  FOR UPDATE USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 4. Auth audit log (security events)
CREATE TABLE IF NOT EXISTS public.auth_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email TEXT,
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_auth_audit_user_time ON public.auth_audit_log (user_id, created_at DESC);
ALTER TABLE public.auth_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own audit" ON public.auth_audit_log;
CREATE POLICY "Users view own audit" ON public.auth_audit_log
  FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users insert own audit" ON public.auth_audit_log;
CREATE POLICY "Users insert own audit" ON public.auth_audit_log
  FOR INSERT TO anon, authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 5. MFA factors (TOTP enrollment metadata; secrets handled by edge fn)
CREATE TABLE IF NOT EXISTS public.mfa_factors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  factor_type TEXT NOT NULL CHECK (factor_type IN ('totp','sms','email','webauthn')),
  friendly_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','revoked')),
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mfa_factors_user ON public.mfa_factors (user_id);
ALTER TABLE public.mfa_factors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own mfa" ON public.mfa_factors;
CREATE POLICY "Users manage own mfa" ON public.mfa_factors
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 6. Helper: check + record login attempts; lock at 5 within 15 min
CREATE OR REPLACE FUNCTION public.check_account_lockout(_email TEXT)
RETURNS TABLE (locked BOOLEAN, locked_until TIMESTAMPTZ, attempts_remaining INT)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _lock RECORD;
  _recent_failures INT;
BEGIN
  SELECT * INTO _lock FROM public.account_lockouts WHERE lower(email) = lower(_email);
  IF _lock.locked_until IS NOT NULL AND _lock.locked_until > now() THEN
    RETURN QUERY SELECT true, _lock.locked_until, 0;
    RETURN;
  END IF;

  SELECT count(*) INTO _recent_failures
  FROM public.auth_login_attempts
  WHERE lower(email) = lower(_email)
    AND success = false
    AND created_at > now() - interval '15 minutes';

  RETURN QUERY SELECT false, NULL::TIMESTAMPTZ, GREATEST(5 - _recent_failures, 0)::INT;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_login_attempt(
  _email TEXT, _success BOOLEAN, _ip TEXT DEFAULT NULL, _ua TEXT DEFAULT NULL, _reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _recent_failures INT;
BEGIN
  INSERT INTO public.auth_login_attempts (email, success, ip_address, user_agent, failure_reason)
  VALUES (_email, _success, _ip, _ua, _reason);

  IF NOT _success THEN
    SELECT count(*) INTO _recent_failures
    FROM public.auth_login_attempts
    WHERE lower(email) = lower(_email) AND success = false
      AND created_at > now() - interval '15 minutes';

    IF _recent_failures >= 5 THEN
      INSERT INTO public.account_lockouts (email, locked_until, reason)
      VALUES (lower(_email), now() + interval '30 minutes', 'too_many_attempts')
      ON CONFLICT (email) DO UPDATE
      SET locked_until = EXCLUDED.locked_until, updated_at = now();
      RETURN true;
    END IF;
  ELSE
    DELETE FROM public.account_lockouts WHERE lower(email) = lower(_email);
  END IF;
  RETURN false;
END;
$$;

CREATE TRIGGER trg_account_lockouts_updated_at
BEFORE UPDATE ON public.account_lockouts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_mfa_factors_updated_at
BEFORE UPDATE ON public.mfa_factors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();