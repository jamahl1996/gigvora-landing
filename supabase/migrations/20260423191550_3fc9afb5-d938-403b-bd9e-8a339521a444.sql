-- Phase 7.1 — Identity & Access schema
-- Adds: profiles, organizations, user_settings, professional_profiles
-- Extends: organization_members (FK to organizations)
-- All tables: RLS enabled, owner-write, configurable read.

-- ─────────────────────────────────────────────────────────────────────────
-- 1. profiles  (public-readable basic identity card; auto-created on signup)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  text,
  username      text UNIQUE,
  avatar_url    text,
  bio           text,
  headline      text,
  location      text,
  website       text,
  is_public     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (is_public = true OR id = auth.uid());

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users delete own profile"
  ON public.profiles FOR DELETE
  USING (id = auth.uid());

CREATE POLICY "Super admins read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_is_public ON public.profiles(is_public) WHERE is_public = true;

-- ─────────────────────────────────────────────────────────────────────────
-- 2. organizations  (top-level org/agency/company entity)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.organizations (
  id           text PRIMARY KEY,         -- slug-style id; matches org_members.organization_id (text)
  name         text NOT NULL,
  slug         text UNIQUE NOT NULL,
  logo_url     text,
  about        text,
  website      text,
  industry     text,
  size         text,                     -- e.g. '1-10','11-50','51-200',...
  is_public    boolean NOT NULL DEFAULT true,
  created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public orgs are viewable by everyone"
  ON public.organizations FOR SELECT
  USING (is_public = true OR public.is_org_member(auth.uid(), id, 'viewer'::org_member_role));

CREATE POLICY "Authenticated users create orgs"
  ON public.organizations FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Org admins update org"
  ON public.organizations FOR UPDATE
  USING (public.is_org_member(auth.uid(), id, 'admin'::org_member_role));

CREATE POLICY "Org owners delete org"
  ON public.organizations FOR DELETE
  USING (public.is_org_member(auth.uid(), id, 'owner'::org_member_role));

CREATE POLICY "Super admins manage orgs"
  ON public.organizations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super-admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_orgs_slug ON public.organizations(slug);
CREATE INDEX idx_orgs_created_by ON public.organizations(created_by);

-- ─────────────────────────────────────────────────────────────────────────
-- 3. user_settings  (per-user preferences)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.user_settings (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme                text NOT NULL DEFAULT 'system',  -- 'light' | 'dark' | 'system'
  locale               text NOT NULL DEFAULT 'en',
  timezone             text NOT NULL DEFAULT 'UTC',
  email_notifications  boolean NOT NULL DEFAULT true,
  push_notifications   boolean NOT NULL DEFAULT true,
  marketing_opt_in     boolean NOT NULL DEFAULT false,
  preferences          jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings"
  ON public.user_settings FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────
-- 4. professional_profiles  (extended pro/creator profile)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.professional_profiles (
  id                 uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  title              text,                                -- e.g. 'Senior Designer'
  hourly_rate_cents  integer CHECK (hourly_rate_cents IS NULL OR hourly_rate_cents >= 0),
  currency           text NOT NULL DEFAULT 'USD',
  availability       text,                                -- 'open' | 'limited' | 'closed'
  skills             text[] NOT NULL DEFAULT ARRAY[]::text[],
  languages          text[] NOT NULL DEFAULT ARRAY[]::text[],
  years_experience   integer CHECK (years_experience IS NULL OR years_experience >= 0),
  portfolio_url      text,
  linkedin_url       text,
  github_url         text,
  is_for_hire        boolean NOT NULL DEFAULT false,
  rating_avg         numeric(3,2),
  rating_count       integer NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pro profiles publicly readable when for-hire"
  ON public.professional_profiles FOR SELECT
  USING (
    is_for_hire = true
    OR id = auth.uid()
    OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'super-admin'::app_role))
  );

CREATE POLICY "Users insert own pro profile"
  ON public.professional_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users update own pro profile"
  ON public.professional_profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users delete own pro profile"
  ON public.professional_profiles FOR DELETE
  USING (id = auth.uid());

CREATE INDEX idx_pro_profiles_for_hire ON public.professional_profiles(is_for_hire) WHERE is_for_hire = true;
CREATE INDEX idx_pro_profiles_skills ON public.professional_profiles USING GIN(skills);

-- ─────────────────────────────────────────────────────────────────────────
-- 5. updated_at trigger fn (single shared utility)
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_touch
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_orgs_touch
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_user_settings_touch
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_pro_profiles_touch
  BEFORE UPDATE ON public.professional_profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 6. Extend new-user trigger: create default profile + settings on signup
--    (the existing handle_new_user_default_role already grants 'user')
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user_identity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- The role-granting trigger already exists from Phase 6. Add identity trigger
-- as a separate trigger so failures in one don't block the other.
DROP TRIGGER IF EXISTS on_auth_user_created_identity ON auth.users;
CREATE TRIGGER on_auth_user_created_identity
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_identity();