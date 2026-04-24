-- ============================================================
-- Phase 06 — auth, role, organization, admin gating foundation
-- ============================================================

-- 1. App role enum -------------------------------------------------------------
do $$ begin
  create type public.app_role as enum (
    -- platform roles (front-end role switcher)
    'user',
    'professional',
    'enterprise',
    -- admin roles (mirror src/lib/adminAuth.tsx AdminRole)
    'super-admin',
    'cs-admin',
    'finance-admin',
    'moderator',
    'trust-safety',
    'dispute-mgr',
    'ads-ops',
    'compliance',
    'marketing-admin'
  );
exception when duplicate_object then null; end $$;

-- 2. user_roles ---------------------------------------------------------------
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id),
  unique (user_id, role)
);

create index if not exists user_roles_user_id_idx on public.user_roles (user_id);
create index if not exists user_roles_role_idx on public.user_roles (role);

alter table public.user_roles enable row level security;

-- 3. organization_members -----------------------------------------------------
do $$ begin
  create type public.org_member_role as enum ('owner', 'admin', 'member', 'viewer');
exception when duplicate_object then null; end $$;

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role public.org_member_role not null default 'member',
  joined_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists org_members_org_idx on public.organization_members (organization_id);
create index if not exists org_members_user_idx on public.organization_members (user_id);

alter table public.organization_members enable row level security;

-- 4. has_role() — SECURITY DEFINER, no RLS recursion --------------------------
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- 5. current_user_roles() — convenience for the front-end role switcher --------
create or replace function public.current_user_roles()
returns public.app_role[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(array_agg(role), array[]::public.app_role[])
  from public.user_roles
  where user_id = auth.uid();
$$;

-- 6. is_org_member() — used by org RLS ----------------------------------------
create or replace function public.is_org_member(
  _user_id uuid,
  _org_id text,
  _min_role public.org_member_role default 'viewer'
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  with role_rank as (
    select case _min_role
      when 'owner' then 4
      when 'admin' then 3
      when 'member' then 2
      else 1
    end as min_rank
  )
  select exists (
    select 1
    from public.organization_members om, role_rank rr
    where om.user_id = _user_id
      and om.organization_id = _org_id
      and case om.member_role
        when 'owner' then 4
        when 'admin' then 3
        when 'member' then 2
        else 1
      end >= rr.min_rank
  );
$$;

-- 7. RLS — user_roles ---------------------------------------------------------
drop policy if exists "Users read own roles" on public.user_roles;
create policy "Users read own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Super admins read all roles" on public.user_roles;
create policy "Super admins read all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'super-admin'));

drop policy if exists "Super admins grant roles" on public.user_roles;
create policy "Super admins grant roles"
  on public.user_roles for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'super-admin'));

drop policy if exists "Super admins revoke roles" on public.user_roles;
create policy "Super admins revoke roles"
  on public.user_roles for delete
  to authenticated
  using (public.has_role(auth.uid(), 'super-admin'));

-- 8. RLS — organization_members -----------------------------------------------
drop policy if exists "Members read own memberships" on public.organization_members;
create policy "Members read own memberships"
  on public.organization_members for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Org admins read org memberships" on public.organization_members;
create policy "Org admins read org memberships"
  on public.organization_members for select
  to authenticated
  using (public.is_org_member(auth.uid(), organization_id, 'admin'));

drop policy if exists "Super admins read all memberships" on public.organization_members;
create policy "Super admins read all memberships"
  on public.organization_members for select
  to authenticated
  using (public.has_role(auth.uid(), 'super-admin'));

drop policy if exists "Org admins manage org memberships" on public.organization_members;
create policy "Org admins manage org memberships"
  on public.organization_members for all
  to authenticated
  using (public.is_org_member(auth.uid(), organization_id, 'admin'))
  with check (public.is_org_member(auth.uid(), organization_id, 'admin'));

drop policy if exists "Super admins manage all memberships" on public.organization_members;
create policy "Super admins manage all memberships"
  on public.organization_members for all
  to authenticated
  using (public.has_role(auth.uid(), 'super-admin'))
  with check (public.has_role(auth.uid(), 'super-admin'));

-- 9. Default role on signup ---------------------------------------------------
-- New users automatically get the 'user' base role so the role switcher
-- always has at least one valid option.
create or replace function public.handle_new_user_default_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_default_role on auth.users;
create trigger on_auth_user_created_default_role
  after insert on auth.users
  for each row execute function public.handle_new_user_default_role();