-- =========================================================
-- POSTS / FEED
-- =========================================================
create type public.post_visibility as enum ('public', 'connections', 'private');

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  body text,
  media_url text,
  media_type text,
  visibility public.post_visibility not null default 'public',
  like_count int not null default 0,
  comment_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.posts enable row level security;

create index idx_posts_author on public.posts(author_id);
create index idx_posts_created on public.posts(created_at desc);

create trigger update_posts_updated_at
before update on public.posts
for each row execute function public.update_updated_at_column();

-- =========================================================
-- FOLLOWS
-- =========================================================
create table public.follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  followee_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);
alter table public.follows enable row level security;
create index idx_follows_followee on public.follows(followee_id);

-- Helper: is A following B?
create or replace function public.is_following(_follower uuid, _followee uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(select 1 from public.follows where follower_id=_follower and followee_id=_followee);
$$;

-- Posts policies
create policy "Public posts visible to authenticated users"
  on public.posts for select to authenticated
  using (
    visibility = 'public'
    or author_id = auth.uid()
    or (visibility = 'connections' and public.is_following(auth.uid(), author_id))
  );

create policy "Users can create their own posts"
  on public.posts for insert to authenticated
  with check (author_id = auth.uid());

create policy "Users can update their own posts"
  on public.posts for update to authenticated
  using (author_id = auth.uid());

create policy "Users can delete their own posts"
  on public.posts for delete to authenticated
  using (author_id = auth.uid());

-- Follows policies
create policy "Follows visible to authenticated"
  on public.follows for select to authenticated using (true);

create policy "Users can follow as themselves"
  on public.follows for insert to authenticated
  with check (follower_id = auth.uid());

create policy "Users can unfollow themselves"
  on public.follows for delete to authenticated
  using (follower_id = auth.uid());

-- =========================================================
-- LIKES
-- =========================================================
create table public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
alter table public.post_likes enable row level security;
create index idx_post_likes_user on public.post_likes(user_id);

create policy "Likes visible to authenticated"
  on public.post_likes for select to authenticated using (true);
create policy "Users can like as themselves"
  on public.post_likes for insert to authenticated
  with check (user_id = auth.uid());
create policy "Users can unlike themselves"
  on public.post_likes for delete to authenticated
  using (user_id = auth.uid());

-- =========================================================
-- COMMENTS
-- =========================================================
create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.post_comments(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.post_comments enable row level security;
create index idx_comments_post on public.post_comments(post_id);

create trigger update_comments_updated_at
before update on public.post_comments
for each row execute function public.update_updated_at_column();

create policy "Comments visible to authenticated"
  on public.post_comments for select to authenticated using (true);
create policy "Users can comment as themselves"
  on public.post_comments for insert to authenticated
  with check (author_id = auth.uid());
create policy "Users can edit own comments"
  on public.post_comments for update to authenticated
  using (author_id = auth.uid());
create policy "Users can delete own comments"
  on public.post_comments for delete to authenticated
  using (author_id = auth.uid());

-- =========================================================
-- COUNTERS via triggers
-- =========================================================
create or replace function public.bump_post_like_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end; $$;

create trigger trg_post_likes_counter
after insert or delete on public.post_likes
for each row execute function public.bump_post_like_count();

create or replace function public.bump_post_comment_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end; $$;

create trigger trg_post_comments_counter
after insert or delete on public.post_comments
for each row execute function public.bump_post_comment_count();

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
create type public.notification_type as enum ('like', 'comment', 'follow', 'mention', 'system');

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  type public.notification_type not null,
  entity_type text,
  entity_id uuid,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create index idx_notifications_user on public.notifications(user_id, created_at desc);

create policy "Users see own notifications"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());
create policy "Users update own notifications"
  on public.notifications for update to authenticated
  using (user_id = auth.uid());
create policy "Users delete own notifications"
  on public.notifications for delete to authenticated
  using (user_id = auth.uid());
-- Inserts happen via triggers (security definer), no insert policy for clients.

-- Auto-notify on like / comment / follow
create or replace function public.notify_on_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare _author uuid;
begin
  select author_id into _author from public.posts where id = new.post_id;
  if _author is not null and _author <> new.user_id then
    insert into public.notifications(user_id, actor_id, type, entity_type, entity_id)
    values (_author, new.user_id, 'like', 'post', new.post_id);
  end if;
  return new;
end; $$;
create trigger trg_notify_like
after insert on public.post_likes
for each row execute function public.notify_on_like();

create or replace function public.notify_on_comment()
returns trigger language plpgsql security definer set search_path = public as $$
declare _author uuid;
begin
  select author_id into _author from public.posts where id = new.post_id;
  if _author is not null and _author <> new.author_id then
    insert into public.notifications(user_id, actor_id, type, entity_type, entity_id, body)
    values (_author, new.author_id, 'comment', 'post', new.post_id, left(new.body, 140));
  end if;
  return new;
end; $$;
create trigger trg_notify_comment
after insert on public.post_comments
for each row execute function public.notify_on_comment();

create or replace function public.notify_on_follow()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications(user_id, actor_id, type, entity_type, entity_id)
  values (new.followee_id, new.follower_id, 'follow', 'user', new.follower_id);
  return new;
end; $$;
create trigger trg_notify_follow
after insert on public.follows
for each row execute function public.notify_on_follow();

-- =========================================================
-- TRACKERS (15-matrix system)
-- =========================================================
create type public.tracker_category as enum (
  'marketplace','hiring','onboarding','design','navigation','shells','seo',
  'feed','finance','ai','security','ops','analytics','support','enterprise'
);

create table public.trackers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  name text not null,
  category public.tracker_category not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, key)
);
alter table public.trackers enable row level security;
create trigger update_trackers_updated_at
before update on public.trackers
for each row execute function public.update_updated_at_column();

create table public.tracker_columns (
  id uuid primary key default gen_random_uuid(),
  tracker_id uuid not null references public.trackers(id) on delete cascade,
  key text not null,
  label text not null,
  type text not null default 'text',
  position int not null default 0,
  required boolean not null default false,
  created_at timestamptz not null default now(),
  unique (tracker_id, key)
);
alter table public.tracker_columns enable row level security;
create index idx_tracker_columns_tracker on public.tracker_columns(tracker_id);

create table public.tracker_rows (
  id uuid primary key default gen_random_uuid(),
  tracker_id uuid not null references public.trackers(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'todo',
  assignee_id uuid references auth.users(id) on delete set null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tracker_rows enable row level security;
create index idx_tracker_rows_tracker on public.tracker_rows(tracker_id);
create trigger update_tracker_rows_updated_at
before update on public.tracker_rows
for each row execute function public.update_updated_at_column();

-- Trackers policies (owner OR admin)
create policy "Owners read trackers"
  on public.trackers for select to authenticated
  using (owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Owners write trackers"
  on public.trackers for all to authenticated
  using (owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  with check (owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Owners read columns"
  on public.tracker_columns for select to authenticated
  using (exists(select 1 from public.trackers t where t.id = tracker_id and (t.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))));
create policy "Owners write columns"
  on public.tracker_columns for all to authenticated
  using (exists(select 1 from public.trackers t where t.id = tracker_id and (t.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))))
  with check (exists(select 1 from public.trackers t where t.id = tracker_id and (t.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))));

create policy "Owners read rows"
  on public.tracker_rows for select to authenticated
  using (exists(select 1 from public.trackers t where t.id = tracker_id and (t.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))));
create policy "Owners write rows"
  on public.tracker_rows for all to authenticated
  using (exists(select 1 from public.trackers t where t.id = tracker_id and (t.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))))
  with check (exists(select 1 from public.trackers t where t.id = tracker_id and (t.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))));

-- =========================================================
-- STORAGE BUCKETS
-- =========================================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('post-media', 'post-media', true)
on conflict (id) do nothing;

create policy "Avatars are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'avatars');
create policy "Users upload own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users update own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users delete own avatar"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Post media publicly viewable"
  on storage.objects for select
  using (bucket_id = 'post-media');
create policy "Users upload own post media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users update own post media"
  on storage.objects for update to authenticated
  using (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users delete own post media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1]);