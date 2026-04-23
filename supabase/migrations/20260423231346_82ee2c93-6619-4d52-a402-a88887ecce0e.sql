-- ============ HIRING / ATS ============
create type public.job_status as enum ('draft','open','closed','archived');
create type public.job_type as enum ('full_time','part_time','contract','internship','temporary');
create type public.job_workplace as enum ('remote','hybrid','onsite');
create type public.application_stage as enum ('applied','screen','interview','offer','hired','rejected','withdrawn');

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  org_name text,
  title text not null,
  slug text not null unique,
  description text,
  location text,
  workplace public.job_workplace not null default 'remote',
  type public.job_type not null default 'full_time',
  salary_min_cents integer,
  salary_max_cents integer,
  currency text not null default 'usd',
  tags text[] not null default '{}',
  status public.job_status not null default 'draft',
  applications_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index jobs_owner_idx on public.jobs(owner_id);
create index jobs_status_idx on public.jobs(status);

alter table public.jobs enable row level security;
create policy "Open jobs visible to all auth"
  on public.jobs for select to authenticated
  using (status in ('open','closed') or owner_id = auth.uid());
create policy "Owners manage jobs"
  on public.jobs for all to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null,
  candidate_id uuid not null,
  cover_letter text,
  resume_url text,
  expected_salary_cents integer,
  stage public.application_stage not null default 'applied',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(job_id, candidate_id)
);
create index ja_job_idx on public.job_applications(job_id);
create index ja_candidate_idx on public.job_applications(candidate_id);

alter table public.job_applications enable row level security;
create policy "Candidates and job owners read"
  on public.job_applications for select to authenticated
  using (
    candidate_id = auth.uid()
    or exists (select 1 from public.jobs j where j.id = job_applications.job_id and j.owner_id = auth.uid())
  );
create policy "Candidates apply"
  on public.job_applications for insert to authenticated
  with check (candidate_id = auth.uid());
create policy "Candidates withdraw / owners manage"
  on public.job_applications for update to authenticated
  using (
    candidate_id = auth.uid()
    or exists (select 1 from public.jobs j where j.id = job_applications.job_id and j.owner_id = auth.uid())
  );
create policy "Candidates delete own"
  on public.job_applications for delete to authenticated
  using (candidate_id = auth.uid());

-- bump count trigger
create or replace function public.bump_job_app_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.jobs set applications_count = applications_count + 1 where id = new.job_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.jobs set applications_count = greatest(applications_count - 1, 0) where id = old.job_id;
    return old;
  end if;
  return null;
end; $$;
create trigger trg_bump_job_app_count
after insert or delete on public.job_applications
for each row execute function public.bump_job_app_count();

create trigger trg_jobs_updated_at before update on public.jobs
for each row execute function public.update_updated_at_column();
create trigger trg_ja_updated_at before update on public.job_applications
for each row execute function public.update_updated_at_column();

-- ============ MESSAGING ============
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null,
  subject text,
  context_type text,        -- 'gig_order' | 'job_application' | null
  context_id uuid,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);
create index cp_user_idx on public.conversation_participants(user_id);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null,
  body text,
  attachment_url text,
  created_at timestamptz not null default now()
);
create index messages_conv_idx on public.messages(conversation_id, created_at desc);

alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

create or replace function public.is_conversation_participant(_conv uuid, _user uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.conversation_participants
    where conversation_id = _conv and user_id = _user);
$$;

create policy "Participants read conv"
  on public.conversations for select to authenticated
  using (public.is_conversation_participant(id, auth.uid()));
create policy "Anyone auth creates conv"
  on public.conversations for insert to authenticated
  with check (created_by = auth.uid());
create policy "Participants update conv"
  on public.conversations for update to authenticated
  using (public.is_conversation_participant(id, auth.uid()));

create policy "Participants read membership"
  on public.conversation_participants for select to authenticated
  using (user_id = auth.uid() or public.is_conversation_participant(conversation_id, auth.uid()));
create policy "Add self / creator adds participants"
  on public.conversation_participants for insert to authenticated
  with check (
    user_id = auth.uid()
    or exists (select 1 from public.conversations c where c.id = conversation_id and c.created_by = auth.uid())
  );
create policy "Update own membership"
  on public.conversation_participants for update to authenticated
  using (user_id = auth.uid());

create policy "Participants read messages"
  on public.messages for select to authenticated
  using (public.is_conversation_participant(conversation_id, auth.uid()));
create policy "Participants send messages"
  on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.is_conversation_participant(conversation_id, auth.uid()));
create policy "Sender deletes own"
  on public.messages for delete to authenticated
  using (sender_id = auth.uid());

create or replace function public.touch_conversation_on_message()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.conversations set last_message_at = now() where id = new.conversation_id;
  -- notify all other participants
  insert into public.notifications(user_id, actor_id, type, entity_type, entity_id, body)
  select cp.user_id, new.sender_id, 'mention', 'message', new.conversation_id, left(coalesce(new.body,'(attachment)'), 140)
  from public.conversation_participants cp
  where cp.conversation_id = new.conversation_id and cp.user_id <> new.sender_id;
  return new;
end; $$;
create trigger trg_touch_conversation
after insert on public.messages
for each row execute function public.touch_conversation_on_message();

-- realtime
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.notifications;