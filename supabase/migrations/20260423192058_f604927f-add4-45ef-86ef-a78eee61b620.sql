-- Phase 7.5 — Social & Networking schema
-- Tables: posts, connections, messages, business_cards

-- ─────────────────────────────────────────────────────────────────────────
-- 1. connections (symmetric, canonical lo/hi ordering — one row per pair)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.connections (
  user_lo_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_hi_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'accepted' CHECK (status IN ('accepted','blocked')),
  initiated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_lo_id, user_hi_id),
  CHECK (user_lo_id < user_hi_id)
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Connections visible to participants" ON public.connections FOR SELECT
  USING (auth.uid() IN (user_lo_id, user_hi_id) OR public.has_role(auth.uid(), 'super-admin'::app_role));
CREATE POLICY "Connections insert by participant" ON public.connections FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (user_lo_id, user_hi_id));
CREATE POLICY "Connections delete by participant" ON public.connections FOR DELETE
  USING (auth.uid() IN (user_lo_id, user_hi_id));

CREATE INDEX idx_connections_lo ON public.connections(user_lo_id);
CREATE INDEX idx_connections_hi ON public.connections(user_hi_id);

-- Helper: are two users connected?
CREATE OR REPLACE FUNCTION public.are_connected(_a uuid, _b uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.connections
    WHERE status = 'accepted'
      AND user_lo_id = LEAST(_a, _b)
      AND user_hi_id = GREATEST(_a, _b)
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- 2. posts
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.posts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body           text NOT NULL CHECK (length(body) BETWEEN 1 AND 10000),
  media          jsonb NOT NULL DEFAULT '[]'::jsonb,
  visibility     text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','connections','private')),
  status         text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived','flagged')),
  reaction_count integer NOT NULL DEFAULT 0,
  comment_count  integer NOT NULL DEFAULT 0,
  link_preview   jsonb,
  published_at   timestamptz NOT NULL DEFAULT now(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts visibility rules" ON public.posts FOR SELECT
  USING (
    author_id = auth.uid()
    OR (status = 'published' AND visibility = 'public')
    OR (status = 'published' AND visibility = 'connections' AND auth.uid() IS NOT NULL AND public.are_connected(author_id, auth.uid()))
    OR public.has_role(auth.uid(), 'super-admin'::app_role)
  );
CREATE POLICY "Posts insert by author" ON public.posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());
CREATE POLICY "Posts update by author" ON public.posts FOR UPDATE
  USING (author_id = auth.uid());
CREATE POLICY "Posts delete by author or moderator" ON public.posts FOR DELETE
  USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'moderator'::app_role) OR public.has_role(auth.uid(), 'super-admin'::app_role));

CREATE INDEX idx_posts_author ON public.posts(author_id, published_at DESC);
CREATE INDEX idx_posts_published ON public.posts(published_at DESC) WHERE status = 'published';

CREATE TRIGGER trg_posts_touch BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 3. messages (direct 1:1 messages with thread grouping)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id    uuid NOT NULL,
  sender_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body         text NOT NULL CHECK (length(body) BETWEEN 1 AND 10000),
  attachments  jsonb NOT NULL DEFAULT '[]'::jsonb,
  read_at      timestamptz,
  edited_at    timestamptz,
  deleted_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (sender_id <> recipient_id)
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages visible to participants" ON public.messages FOR SELECT
  USING (auth.uid() IN (sender_id, recipient_id) OR public.has_role(auth.uid(), 'super-admin'::app_role));
CREATE POLICY "Messages insert by sender" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Messages update by sender or recipient (read)" ON public.messages FOR UPDATE
  USING (auth.uid() IN (sender_id, recipient_id));
CREATE POLICY "Messages delete by sender" ON public.messages FOR DELETE
  USING (sender_id = auth.uid());

CREATE INDEX idx_messages_thread ON public.messages(thread_id, created_at);
CREATE INDEX idx_messages_recipient_unread ON public.messages(recipient_id) WHERE read_at IS NULL;
CREATE INDEX idx_messages_sender ON public.messages(sender_id, created_at DESC);

-- Realtime: emit changes to posts and messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER TABLE public.posts REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- ─────────────────────────────────────────────────────────────────────────
-- 4. business_cards
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE public.business_cards (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shortcode     text UNIQUE NOT NULL,
  display_name  text NOT NULL,
  title         text,
  company       text,
  bio           text,
  email         text,
  phone         text,
  website       text,
  links         jsonb NOT NULL DEFAULT '[]'::jsonb,   -- [{label,url,icon}]
  avatar_url    text,
  cover_url     text,
  theme         text NOT NULL DEFAULT 'default',
  is_public     boolean NOT NULL DEFAULT true,
  view_count    integer NOT NULL DEFAULT 0,
  save_count    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.business_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public cards visible to all" ON public.business_cards FOR SELECT
  USING (is_public = true OR owner_id = auth.uid());
CREATE POLICY "Owner inserts card" ON public.business_cards FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner updates card" ON public.business_cards FOR UPDATE
  USING (owner_id = auth.uid());
CREATE POLICY "Owner deletes card" ON public.business_cards FOR DELETE
  USING (owner_id = auth.uid());

CREATE INDEX idx_business_cards_owner ON public.business_cards(owner_id);
CREATE INDEX idx_business_cards_shortcode ON public.business_cards(shortcode);

CREATE TRIGGER trg_business_cards_touch BEFORE UPDATE ON public.business_cards
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();