-- Phase 2 skeleton (PHASE1_PROMPT.md §11): orders, order_events, payments.
-- No UI uses these yet. Created now so Phase 2 plugs in without reshaping data.

-- Canonical steps (§11), then the final/side-exit statuses.
create type public.order_status as enum (
  'confirmed',          -- 1 الطلب اتأكد
  'funds_held',         -- 2 الفلوس اتحفظت
  'inspection',         -- 3 الفحص (skipped for inspected devices)
  'inspection_report',  -- 4 تقرير الفحص (skipped for inspected devices)
  'shipping',           -- 5 الشحن (to the buyer's door)
  'delivered',          -- 6 الاستلام
  'trial',              -- 7 فترة التجربة
  'released_to_seller', -- final: اتحوّل للبايع
  'cancelled_refunded',
  'returned',
  'replaced'
);
create type public.payment_kind as enum ('reservation_deposit', 'balance', 'seller_fee', 'refund', 'seller_payout');
create type public.payment_status as enum ('pending', 'confirmed', 'rejected', 'refunded');

create sequence public.order_code_seq start 2001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique default ('#' || nextval('public.order_code_seq')),
  buyer_id uuid not null references public.profiles (id) on delete restrict,
  device_id uuid not null references public.devices (id) on delete restrict,
  status public.order_status not null default 'confirmed',
  price int not null check (price >= 0),
  deposit int not null default 0 check (deposit >= 0),
  discount_code text,
  delivery_name text,
  delivery_phone text,
  delivery_governorate text,
  delivery_address text,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_buyer_idx on public.orders (buyer_id, created_at desc);
create index orders_device_idx on public.orders (device_id);

create table public.order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.order_status not null,
  note text,
  actor_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index order_events_order_idx on public.order_events (order_id, created_at);
create index order_events_actor_idx on public.order_events (actor_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete restrict,
  submission_id uuid references public.seller_submissions (id) on delete set null,
  payer_id uuid references public.profiles (id) on delete set null,
  kind public.payment_kind not null,
  amount int not null check (amount >= 0),
  method text,              -- instapay / bank / cash … (manual in Phase 2)
  reference text,
  receipt_key text,
  status public.payment_status not null default 'pending',
  confirmed_by uuid references public.profiles (id) on delete set null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_order_idx on public.payments (order_id);
create index payments_submission_idx on public.payments (submission_id);
create index payments_payer_idx on public.payments (payer_id);
create index payments_confirmed_by_idx on public.payments (confirmed_by);

-- Inspections after an order point at it.
alter table public.inspections add column order_id uuid references public.orders (id) on delete set null;
create index inspections_order_idx on public.inspections (order_id);

create trigger orders_updated_at before update on public.orders
  for each row execute function private.set_updated_at();
create trigger payments_updated_at before update on public.payments
  for each row execute function private.set_updated_at();
