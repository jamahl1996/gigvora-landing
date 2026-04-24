-- ============================================================================
-- Phase 8 — Core Schema Wave 2
-- Feed, connections, notifications, threads, messages, saved items
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. CONNECTION REQUESTS (pending → accepted/declined/withdrawn/expired)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.connection_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id  uuid NOT NULL,
  recipient_id  uuid NOT NULL,
  status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','accepted','declined','withdrawn','expired')),
  message       text CHECK (message IS NULL OR length(message) <= 1000),
  created_at    timestamptz NOT NULL DEFAULT now(),
  responded_at  timestamptz,
  expires_at    timestamptz NOT NULL DEFAULT (now() + interval '90 days'),
  CONSTRAINT cr_no_self CHECK (requester_id <> recipient_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS cr_open_unique
  ON public.connection_requests(LEAST(requester_id, recipient_id), GREATEST(requester_id, recipient_id))
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS cr_recipient_idx
  ON public.connection_requests(recipient_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS cr_requester_idx
  ON public.connection_requests(requester_id, status, created_at DESC);

ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants view connection requests"
  ON public.connection_requests FOR SELECT
  USING (
    requester_id = auth.uid()
    OR recipient_id = auth.uid()
    OR public.has_role(auth.uid(), 'super-admin'::public.app_role)
  );

CREATE POLICY "Requester creates connection request"
  ON public.connection_requests FOR INSERT TO authenticated
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Participants update connection request"
  ON public.connection_requests FOR UPDATE
  USING (requester_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Requester withdraws connection request"
  ON public.connection_requests FOR DELETE
  USING (requester_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 2. FOLLOWS (asymmetric)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id  uuid NOT NULL,
  followee_id  uuid NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id),
  CONSTRAINT follows_no_self CHECK (follower_id <> followee_id)
);
CREATE INDEX IF NOT EXISTS follows_followee_idx ON public.follows(followee_id, created_at DESC);
CREATE INDEX IF NOT EXISTS follows_follower_idx ON public.follows(follower_id, created_at DESC);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are public-readable"
  ON public.follows FOR SELECT USING (true);

CREATE POLICY "Users create own follow edges"
  ON public.follows FOR INSERT TO authenticated
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users delete own follow edges"
  ON public.follows FOR DELETE
  USING (follower_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3. USER BLOCKS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_blocks (
  blocker_id  uuid NOT NULL,
  blocked_id  uuid NOT NULL,
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CONSTRAINT block_no_self CHECK (blocker_id <> blocked_id)
);
CREATE INDEX IF NOT EXISTS user_blocks_blocked_idx ON public.user_blocks(blocked_id);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blocker views own blocks"
  ON public.user_blocks FOR SELECT
  USING (blocker_id = auth.uid() OR public.has_role(auth.uid(),'super-admin'::public.app_role));

CREATE POLICY "Blocker creates own blocks"
  ON public.user_blocks FOR INSERT TO authenticated
  WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Blocker removes own blocks"
  ON public.user_blocks FOR DELETE
  USING (blocker_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 4. POST REACTIONS + COMMENTS (extend existing public.posts)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.post_reactions (
  post_id    uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  actor_id   uuid NOT NULL,
  kind       text NOT NULL DEFAULT 'like'
               CHECK (kind IN ('like','celebrate','support','insightful','curious')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, actor_id, kind)
);
CREATE INDEX IF NOT EXISTS post_reactions_actor_idx
  ON public.post_reactions(actor_id, created_at DESC);

ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions readable when post readable"
  ON public.post_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = post_reactions.post_id
        AND (
          p.author_id = auth.uid()
          OR (p.status='published' AND p.visibility='public')
          OR (p.status='published' AND p.visibility='connections'
              AND auth.uid() IS NOT NULL
              AND public.are_connected(p.author_id, auth.uid()))
          OR public.has_role(auth.uid(),'super-admin'::public.app_role)
        )
    )
  );

CREATE POLICY "Actor inserts own reaction"
  ON public.post_reactions FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

CREATE POLICY "Actor deletes own reaction"
  ON public.post_reactions FOR DELETE
  USING (actor_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.post_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL,
  parent_id  uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
  body       text NOT NULL CHECK (length(body) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS post_comments_post_idx
  ON public.post_comments(post_id, created_at);
CREATE INDEX IF NOT EXISTS post_comments_author_idx
  ON public.post_comments(author_id, created_at DESC);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments readable when post readable"
  ON public.post_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = post_comments.post_id
        AND (
          p.author_id = auth.uid()
          OR (p.status='published' AND p.visibility='public')
          OR (p.status='published' AND p.visibility='connections'
              AND auth.uid() IS NOT NULL
              AND public.are_connected(p.author_id, auth.uid()))
          OR public.has_role(auth.uid(),'super-admin'::public.app_role)
        )
    )
  );

CREATE POLICY "Author inserts own comment"
  ON public.post_comments FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Author updates own comment"
  ON public.post_comments FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Author or moderator deletes comment"
  ON public.post_comments FOR DELETE
  USING (
    author_id = auth.uid()
    OR public.has_role(auth.uid(),'moderator'::public.app_role)
    OR public.has_role(auth.uid(),'super-admin'::public.app_role)
  );

-- updated_at trigger
DROP TRIGGER IF EXISTS post_comments_touch_updated ON public.post_comments;
CREATE TRIGGER post_comments_touch_updated
  BEFORE UPDATE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 5. MESSAGE THREADS (group existing public.messages rows)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.message_threads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids uuid[] NOT NULL,
  subject         text,
  last_message_at timestamptz,
  last_message_preview text,
  archived_by     uuid[] NOT NULL DEFAULT ARRAY[]::uuid[],
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mt_min_two CHECK (array_length(participant_ids, 1) >= 2)
);
CREATE INDEX IF NOT EXISTS message_threads_participants_idx
  ON public.message_threads USING gin(participant_ids);
CREATE INDEX IF NOT EXISTS message_threads_recent_idx
  ON public.message_threads(last_message_at DESC NULLS LAST);

ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants read threads"
  ON public.message_threads FOR SELECT
  USING (
    auth.uid() = ANY(participant_ids)
    OR public.has_role(auth.uid(),'super-admin'::public.app_role)
  );

CREATE POLICY "Authenticated user creates thread they belong to"
  ON public.message_threads FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = ANY(participant_ids));

CREATE POLICY "Participants update thread"
  ON public.message_threads FOR UPDATE
  USING (auth.uid() = ANY(participant_ids));

DROP TRIGGER IF EXISTS message_threads_touch_updated ON public.message_threads;
CREATE TRIGGER message_threads_touch_updated
  BEFORE UPDATE ON public.message_threads
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 6. NOTIFICATIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL,
  kind        text NOT NULL,
  title       text NOT NULL,
  body        text,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  link_url    text,
  actor_id    uuid,
  source_kind text,
  source_id   text,
  seen_at     timestamptz,
  read_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_user_recent_idx
  ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_user_unread_idx
  ON public.notifications(user_id, created_at DESC) WHERE read_at IS NULL;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User reads own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'super-admin'::public.app_role));

CREATE POLICY "Authenticated insert notification (server-side)"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (true);  -- writes go through server fns / triggers; clients rarely insert

CREATE POLICY "User updates own notification (mark read/seen)"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "User deletes own notification"
  ON public.notifications FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 7. SAVED ITEMS (polymorphic)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL,
  item_kind    text NOT NULL CHECK (item_kind IN (
                 'post','gig','service','project','job','profile','organization','article','reel'
               )),
  item_id      text NOT NULL,
  collection   text,
  note         text CHECK (note IS NULL OR length(note) <= 2000),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_kind, item_id)
);
CREATE INDEX IF NOT EXISTS saved_items_user_recent_idx
  ON public.saved_items(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS saved_items_kind_idx
  ON public.saved_items(user_id, item_kind, created_at DESC);

ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User views own saves"
  ON public.saved_items FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "User creates own saves"
  ON public.saved_items FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "User updates own saves"
  ON public.saved_items FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "User removes own saves"
  ON public.saved_items FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 8. THREAD AUTO-UPDATE TRIGGER on messages
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bump_thread_on_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.message_threads
     SET last_message_at = NEW.created_at,
         last_message_preview = LEFT(NEW.body, 200),
         updated_at = NEW.created_at
   WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS messages_bump_thread ON public.messages;
CREATE TRIGGER messages_bump_thread
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.bump_thread_on_message();

-- ---------------------------------------------------------------------------
-- 9. REALTIME PUBLICATION
-- ---------------------------------------------------------------------------
ALTER TABLE public.posts             REPLICA IDENTITY FULL;
ALTER TABLE public.post_reactions    REPLICA IDENTITY FULL;
ALTER TABLE public.post_comments     REPLICA IDENTITY FULL;
ALTER TABLE public.messages          REPLICA IDENTITY FULL;
ALTER TABLE public.message_threads   REPLICA IDENTITY FULL;
ALTER TABLE public.notifications     REPLICA IDENTITY FULL;
ALTER TABLE public.connection_requests REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.posts'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.post_reactions'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.messages'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.message_threads'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.connection_requests'; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;