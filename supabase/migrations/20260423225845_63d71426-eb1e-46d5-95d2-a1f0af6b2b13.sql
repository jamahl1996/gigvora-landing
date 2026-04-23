-- Marketplace tables
create table if not exists public.gigs (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null,
  slug text not null unique,
  title text not null,
  description text,
  category text not null default 'other',
  tags text[] not null default '{}',
  cover_url text,
  status text not null default 'draft', -- draft | active | paused | archived
  rating_avg numeric(3,2) not null default 0,
  rating_count integer not null default 0,
  orders_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gigs_seller on public.gigs(seller_id);
create index if not exists idx_gigs_status on public.gigs(status);
create index if not exists idx_gigs_category on public.gigs(category);

create table if not exists public.gig_packages (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete cascade,
  tier text not null, -- basic | standard | premium
  title text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd',
  delivery_days integer not null default 7,
  revisions integer not null default 1,
  features jsonb not null default '[]'::jsonb,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (gig_id, tier)
);

create index if not exists idx_gig_packages_gig on public.gig_packages(gig_id);

create table if not exists public.gig_orders (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete restrict,
  package_id uuid not null references public.gig_packages(id) on delete restrict,
  buyer_id uuid not null,
  seller_id uuid not null,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'pending', -- pending | paid | in_progress | delivered | completed | cancelled | refunded
  stripe_session_id text,
  stripe_payment_intent text,
  requirements text,
  delivered_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_buyer on public.gig_orders(buyer_id);
create index if not exists idx_orders_seller on public.gig_orders(seller_id);
create index if not exists idx_orders_gig on public.gig_orders(gig_id);
create unique index if not exists idx_orders_session on public.gig_orders(stripe_session_id) where stripe_session_id is not null;

create table if not exists public.gig_reviews (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete cascade,
  order_id uuid not null references public.gig_orders(id) on delete cascade,
  reviewer_id uuid not null,
  rating integer not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  unique (order_id)
);

create index if not exists idx_reviews_gig on public.gig_reviews(gig_id);

-- Stripe Connect accounts (sellers)
create table if not exists public.seller_accounts (
  user_id uuid primary key,
  stripe_account_id text unique,
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  details_submitted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated_at triggers
drop trigger if exists trg_gigs_updated on public.gigs;
create trigger trg_gigs_updated before update on public.gigs
  for each row execute function public.update_updated_at_column();

drop trigger if exists trg_orders_updated on public.gig_orders;
create trigger trg_orders_updated before update on public.gig_orders
  for each row execute function public.update_updated_at_column();

drop trigger if exists trg_seller_accounts_updated on public.seller_accounts;
create trigger trg_seller_accounts_updated before update on public.seller_accounts
  for each row execute function public.update_updated_at_column();

-- Bump rating + orders count after review/order changes
create or replace function public.refresh_gig_aggregates()
returns trigger language plpgsql security definer set search_path = public as $$
declare _gig uuid;
begin
  _gig := coalesce(new.gig_id, old.gig_id);
  update public.gigs
    set rating_avg = coalesce((select round(avg(rating)::numeric, 2) from public.gig_reviews where gig_id = _gig), 0),
        rating_count = (select count(*) from public.gig_reviews where gig_id = _gig),
        orders_count = (select count(*) from public.gig_orders where gig_id = _gig and status in ('paid','in_progress','delivered','completed'))
  where id = _gig;
  return null;
end; $$;

drop trigger if exists trg_reviews_agg on public.gig_reviews;
create trigger trg_reviews_agg after insert or update or delete on public.gig_reviews
  for each row execute function public.refresh_gig_aggregates();

drop trigger if exists trg_orders_agg on public.gig_orders;
create trigger trg_orders_agg after insert or update or delete on public.gig_orders
  for each row execute function public.refresh_gig_aggregates();

-- RLS
alter table public.gigs enable row level security;
alter table public.gig_packages enable row level security;
alter table public.gig_orders enable row level security;
alter table public.gig_reviews enable row level security;
alter table public.seller_accounts enable row level security;

-- gigs: anyone authed can read active gigs; sellers manage their own
drop policy if exists "Active gigs visible to all" on public.gigs;
create policy "Active gigs visible to all" on public.gigs for select to authenticated
  using (status = 'active' or seller_id = auth.uid());
drop policy if exists "Sellers manage own gigs" on public.gigs;
create policy "Sellers manage own gigs" on public.gigs for all to authenticated
  using (seller_id = auth.uid()) with check (seller_id = auth.uid());

-- gig_packages: visible if parent visible; mutated by gig owner
drop policy if exists "Packages visible with gig" on public.gig_packages;
create policy "Packages visible with gig" on public.gig_packages for select to authenticated
  using (exists (select 1 from public.gigs g where g.id = gig_id and (g.status = 'active' or g.seller_id = auth.uid())));
drop policy if exists "Sellers manage packages" on public.gig_packages;
create policy "Sellers manage packages" on public.gig_packages for all to authenticated
  using (exists (select 1 from public.gigs g where g.id = gig_id and g.seller_id = auth.uid()))
  with check (exists (select 1 from public.gigs g where g.id = gig_id and g.seller_id = auth.uid()));

-- gig_orders: buyer or seller can read; buyer creates; seller updates status
drop policy if exists "Order parties read" on public.gig_orders;
create policy "Order parties read" on public.gig_orders for select to authenticated
  using (buyer_id = auth.uid() or seller_id = auth.uid());
drop policy if exists "Buyers create orders" on public.gig_orders;
create policy "Buyers create orders" on public.gig_orders for insert to authenticated
  with check (buyer_id = auth.uid());
drop policy if exists "Order parties update" on public.gig_orders;
create policy "Order parties update" on public.gig_orders for update to authenticated
  using (buyer_id = auth.uid() or seller_id = auth.uid());

-- reviews: anyone can read; only buyer of the order can write
drop policy if exists "Reviews public read" on public.gig_reviews;
create policy "Reviews public read" on public.gig_reviews for select to authenticated using (true);
drop policy if exists "Buyer writes review" on public.gig_reviews;
create policy "Buyer writes review" on public.gig_reviews for insert to authenticated
  with check (reviewer_id = auth.uid() and exists (select 1 from public.gig_orders o where o.id = order_id and o.buyer_id = auth.uid() and o.status = 'completed'));
drop policy if exists "Buyer edits review" on public.gig_reviews;
create policy "Buyer edits review" on public.gig_reviews for update to authenticated using (reviewer_id = auth.uid());
drop policy if exists "Buyer deletes review" on public.gig_reviews;
create policy "Buyer deletes review" on public.gig_reviews for delete to authenticated using (reviewer_id = auth.uid());

-- seller_accounts: only the user
drop policy if exists "Seller reads own account" on public.seller_accounts;
create policy "Seller reads own account" on public.seller_accounts for select to authenticated using (user_id = auth.uid());
drop policy if exists "Seller upserts own account" on public.seller_accounts;
create policy "Seller upserts own account" on public.seller_accounts for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "Seller updates own account" on public.seller_accounts;
create policy "Seller updates own account" on public.seller_accounts for update to authenticated using (user_id = auth.uid());

-- Storage bucket for gig cover/media
insert into storage.buckets (id, name, public) values ('gig-media', 'gig-media', true)
  on conflict (id) do nothing;

drop policy if exists "Gig media public read" on storage.objects;
create policy "Gig media public read" on storage.objects for select using (bucket_id = 'gig-media');
drop policy if exists "Gig media owner upload" on storage.objects;
create policy "Gig media owner upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'gig-media' and auth.uid()::text = (storage.foldername(name))[1]);
drop policy if exists "Gig media owner update" on storage.objects;
create policy "Gig media owner update" on storage.objects for update to authenticated
  using (bucket_id = 'gig-media' and auth.uid()::text = (storage.foldername(name))[1]);
drop policy if exists "Gig media owner delete" on storage.objects;
create policy "Gig media owner delete" on storage.objects for delete to authenticated
  using (bucket_id = 'gig-media' and auth.uid()::text = (storage.foldername(name))[1]);
