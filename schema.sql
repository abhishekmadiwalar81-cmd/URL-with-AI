-- S S Traders (Karnataka, India) Supabase Schema
-- Run this in your Supabase SQL Editor (Project ID: qyoqamviapkknidyspkc)

-- 1. Bookings (Depot & Showroom Visits)
create table if not exists public.bookings (
  id text primary key,
  reference_code text unique not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  company_name text,
  purpose text not null,
  specialist text not null,
  visit_date date not null,
  time_slot text not null,
  estimated_scope text,
  notes text,
  status text not null default 'pending',
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for date and time slot collision checking
create index if not exists idx_bookings_date_slot on public.bookings (visit_date, time_slot);

-- 2. Quotes (Wholesale Rate Card & Material Requests)
create table if not exists public.quotes (
  id text primary key,
  reference_code text unique not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  company_name text,
  customer_type text not null,
  delivery_district text not null,
  items jsonb not null default '[]'::jsonb,
  project_notes text,
  urgency text not null default 'within_1_week',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Products (Verified Building Materials & Coatings)
create table if not exists public.products (
  id text primary key,
  category text not null,
  category_label text not null,
  name text not null,
  brand text not null,
  description text,
  specs text[] default '{}',
  unit text,
  indicative_price text,
  in_stock boolean default true,
  min_order_qty text,
  verification_source text,
  is_flagged_for_owner_review boolean default false
);

-- 4. Blocked Dates (Warehouse Closures & Holidays)
create table if not exists public.blocked_dates (
  date date primary key,
  reason text not null
);

-- 5. Business Settings
create table if not exists public.settings (
  id text primary key default 'primary',
  data jsonb not null
);

-- Enable Row Level Security (RLS) with permissive read/insert for public users and full access for anon
alter table public.bookings enable row level security;
alter table public.quotes enable row level security;
alter table public.products enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.settings enable row level security;

-- Policies for public access via publishable key
create policy "Allow public read products" on public.products for select using (true);
create policy "Allow public insert bookings" on public.bookings for insert with check (true);
create policy "Allow public select bookings" on public.bookings for select using (true);
create policy "Allow public update bookings" on public.bookings for update using (true);

create policy "Allow public insert quotes" on public.quotes for insert with check (true);
create policy "Allow public select quotes" on public.quotes for select using (true);
create policy "Allow public update quotes" on public.quotes for update using (true);

create policy "Allow public read blocked_dates" on public.blocked_dates for select using (true);
create policy "Allow public read settings" on public.settings for select using (true);
