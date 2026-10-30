-- استعمال طبيب — Phase 1 schema (PHASE1_PROMPT.md §7).
-- Enums, tables, public-code sequences, updated_at triggers and FK indexes.
-- RLS, grants and views are in the next migration.

-- ── Schemas ──────────────────────────────────────────────────────────────────
-- `private` holds helpers and admin-only lookup tables. It is NOT exposed by the
-- Data API; anon/authenticated only get USAGE so policies can call its functions.
create schema if not exists private;

-- ── Enums ────────────────────────────────────────────────────────────────────
create type public.account_type as enum ('doctor', 'student', 'clinic');
create type public.user_role as enum ('user', 'admin');
-- Same ids as the app (src/lib/demo/types.ts DeviceType); labels live in the app.
create type public.device_type as enum (
  'unit', 'xray', 'autoclave', 'surg', 'endo', 'apex', 'cure',
  'rotary', 'contra', 'micro', 'iocam', 'cam', 'loupe', 'other'
);
-- a = ممتازة 81–100% · b = جيدة 60–80% · c = أقل من 60%
create type public.device_condition as enum ('a', 'b', 'c');
create type public.inspection_state as enum ('inspected', 'on_order');
create type public.yes_no_unknown as enum ('yes', 'no', 'unknown');
create type public.device_source as enum ('company', 'seller');
create type public.device_status as enum ('draft', 'published', 'reserved', 'sold', 'hidden');
create type public.device_media_kind as enum ('photo', 'video');
create type public.submission_media_kind as enum ('photo', 'video', 'accessory');
create type public.inspection_kind as enum ('pre_publish', 'after_order');
create type public.inspection_status as enum ('needs_tech', 'scheduled', 'late', 'needs_review', 'done');
create type public.keep_location as enum ('with_seller', 'send_to_platform');
create type public.fee_status as enum ('pending', 'paid', 'refunded', 'forfeited');
create type public.submission_status as enum ('new', 'follow_up', 'accepted', 'rejected');
create type public.inspection_pref as enum ('any', 'inspected_only');
create type public.request_status as enum ('new', 'notified', 'closed');

-- ── Public-code sequences (§2.1 #5: L-###, #1024, F-###, R-###) ─────────────
-- Prefixes mirror BUSINESS.codePrefixes in src/config/business.ts.
create sequence public.device_code_seq start 201;
create sequence public.submission_code_seq start 1001;
create sequence public.inspection_code_seq start 201;
create sequence public.request_code_seq start 101;

-- ── Helpers ──────────────────────────────────────────────────────────────────
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ── profiles ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,                                  -- copied from auth.users for the admin UI
  full_name text,
  phone text,                                  -- stored as typed (normalized digits)
  phone_verified boolean not null default false, -- team verifies on first WhatsApp contact
  governorate text,
  address text,
  account_type public.account_type,            -- null until onboarding
  role public.user_role not null default 'user',
  onboarded_at timestamptz,                    -- set when /onboarding is completed
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_email_idx on public.profiles (lower(email));

-- ── devices ──────────────────────────────────────────────────────────────────
-- Every column here is public (RLS limits rows to public statuses for non-admins).
-- Internal data (cost, seller net, sale reason, seller, source submission) lives in
-- device_private.
create table public.devices (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique default ('L-' || nextval('public.device_code_seq')),
  title text not null,
  type public.device_type not null,
  brand text,
  model text,
  details text,
  origin text,
  capacity text,
  manufacture_year int check (manufacture_year between 1950 and 2100),
  governorate text,
  accessories text,
  condition public.device_condition not null,
  inspection_state public.inspection_state not null default 'on_order',
  efficiency text,
  declared_defects text,
  has_box boolean,
  repaired_before public.yes_no_unknown,
  sale_price int not null check (sale_price >= 0),
  maintenance_months int not null default 3 check (maintenance_months in (3, 6)),
  source public.device_source not null default 'company',
  status public.device_status not null default 'draft',
  featured boolean not null default false,
  views int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index devices_status_idx on public.devices (status, published_at desc);
create index devices_type_idx on public.devices (type);

-- ── seller_submissions ───────────────────────────────────────────────────────
create table public.seller_submissions (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique default ('#' || nextval('public.submission_code_seq')),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null,
  phone text not null,
  governorate text not null,
  pickup_address text not null,
  lat double precision,
  lng double precision,
  device_type public.device_type not null,
  brand text,
  details text,
  accessories text,
  sale_reason text,                    -- internal: admins only, never public
  condition public.device_condition,   -- null when the seller asked us to repair it
  wants_repair boolean not null default false,
  repair_description text,
  has_warranty boolean,
  warranty_remaining text,
  has_box boolean,
  repaired_before public.yes_no_unknown,
  repaired_details text,
  defects text,
  keep_location public.keep_location not null default 'with_seller',
  price_help boolean not null default false, -- «ساعدوني أحدد السعر»
  sale_price int check (sale_price >= 0),
  seller_net int check (seller_net >= 0),
  fee_status public.fee_status not null default 'pending',
  fee_reference text,
  status public.submission_status not null default 'new',
  reject_reason text,
  admin_log jsonb not null default '[]'::jsonb,
  device_id uuid references public.devices (id) on delete set null, -- set on accept
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seller_submissions_condition_or_repair check (condition is not null or wants_repair)
);
create index seller_submissions_seller_idx on public.seller_submissions (seller_id, created_at desc);
create index seller_submissions_device_idx on public.seller_submissions (device_id);
create index seller_submissions_status_idx on public.seller_submissions (status, created_at desc);

create table public.submission_media (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.seller_submissions (id) on delete cascade,
  kind public.submission_media_kind not null,
  r2_key text not null,
  mime text,
  size_bytes bigint,
  width int,
  height int,
  duration_sec numeric,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index submission_media_submission_idx on public.submission_media (submission_id, sort_order);

-- ── device_private (admin-only) ──────────────────────────────────────────────
create table public.device_private (
  device_id uuid primary key references public.devices (id) on delete cascade,
  purchase_cost int,
  seller_net int,
  sale_reason text,
  internal_notes text,
  location_now text,
  seller_id uuid references public.profiles (id) on delete set null,
  submission_id uuid references public.seller_submissions (id) on delete set null,
  updated_at timestamptz not null default now()
);
create index device_private_seller_idx on public.device_private (seller_id);
create index device_private_submission_idx on public.device_private (submission_id);

-- ── device_media ─────────────────────────────────────────────────────────────
create table public.device_media (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices (id) on delete cascade,
  kind public.device_media_kind not null,
  r2_key text not null,
  width int,
  height int,
  duration_sec numeric,
  sort_order int not null default 0,
  is_defect boolean not null default false,
  created_at timestamptz not null default now()
);
create index device_media_device_idx on public.device_media (device_id, sort_order);

-- ── inspections ──────────────────────────────────────────────────────────────
-- checklist: [{key, label, group: 'core'|'category', ok: bool, note}]
-- TODO(open question §12.8): per-device-type checklist templates. Phase 1 = 4 core rows
-- (التشغيل، الحالة الظاهرية، الأجزاء المتغيرة، الصيانة السابقة) + optional extra rows.
create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique default ('F-' || nextval('public.inspection_code_seq')),
  device_id uuid references public.devices (id) on delete cascade,
  submission_id uuid references public.seller_submissions (id) on delete set null,
  kind public.inspection_kind not null default 'pre_publish',
  title text,                       -- device name as shown in the admin week list
  location text,                    -- «عند البايع · مدينة نصر» | «مقر الفحص»
  technician_name text,
  scheduled_at timestamptz,
  status public.inspection_status not null default 'needs_tech',
  checklist jsonb not null default '[]'::jsonb,
  overall_efficiency text,
  appearance text,
  serial_no text,
  replaced_parts text,
  condition public.device_condition,
  defects text,
  report_pdf_key text,
  approved_by uuid references public.profiles (id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inspections_checklist_is_array check (jsonb_typeof(checklist) = 'array')
);
create index inspections_device_idx on public.inspections (device_id);
create index inspections_submission_idx on public.inspections (submission_id);
create index inspections_approved_by_idx on public.inspections (approved_by);
create index inspections_scheduled_idx on public.inspections (scheduled_at);

-- ── device_requests («اطلب جهاز») ────────────────────────────────────────────
create table public.device_requests (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique default ('R-' || nextval('public.request_code_seq')),
  user_id uuid not null references public.profiles (id) on delete cascade,
  full_name text,                   -- contact as typed on the form (pre-filled from profile)
  phone text,
  device_type public.device_type not null,
  brand_pref text,
  budget_min int check (budget_min >= 0),
  budget_max int check (budget_max >= 0),
  needed_by text,
  governorate text,
  inspection_pref public.inspection_pref not null default 'any',
  notes text,
  status public.request_status not null default 'new',
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint device_requests_budget_order check (budget_min is null or budget_max is null or budget_min <= budget_max)
);
create index device_requests_user_idx on public.device_requests (user_id, created_at desc);
create index device_requests_status_idx on public.device_requests (status, created_at desc);

-- ── favorites ────────────────────────────────────────────────────────────────
create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  device_id uuid not null references public.devices (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, device_id)
);
create index favorites_device_idx on public.favorites (device_id);

-- ── audit_log ────────────────────────────────────────────────────────────────
create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id) on delete set null,
  entity text not null,
  entity_id text not null,
  action text not null,
  data jsonb,
  created_at timestamptz not null default now()
);
create index audit_log_actor_idx on public.audit_log (actor_id);
create index audit_log_entity_idx on public.audit_log (entity, entity_id, created_at desc);

-- ── updated_at triggers ──────────────────────────────────────────────────────
create trigger profiles_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();
create trigger devices_updated_at before update on public.devices
  for each row execute function private.set_updated_at();
create trigger device_private_updated_at before update on public.device_private
  for each row execute function private.set_updated_at();
create trigger seller_submissions_updated_at before update on public.seller_submissions
  for each row execute function private.set_updated_at();
create trigger inspections_updated_at before update on public.inspections
  for each row execute function private.set_updated_at();
create trigger device_requests_updated_at before update on public.device_requests
  for each row execute function private.set_updated_at();
