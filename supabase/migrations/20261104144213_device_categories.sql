-- Device categories managed from the dashboard (client, WhatsApp 4 Nov 2026):
-- add new types (they show in the site filters and forms) and give each type
-- its own detail fields (e.g. camera → memory 128 / 256 GB, flash…).
-- The 14 fixed enum values become rows; the columns become text + FK.

create table public.device_categories (
  id text primary key check (id ~ '^[a-z0-9_]{2,40}$'),
  label text not null check (length(trim(label)) between 2 and 60),
  sort int not null default 100,
  active boolean not null default true,       -- hidden ones stay on existing devices
  art text not null default 'other',          -- which built-in drawing to show
  -- [{ "key": "memory", "label": "الذاكرة", "kind": "select"|"text"|"number", "options": ["128 GB"], "unit": "GB" }]
  fields jsonb not null default '[]'::jsonb check (jsonb_typeof(fields) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
insert into public.device_categories (id, label, sort, art) values
  ('surg', 'موتور جراحة وزراعة', 10, 'surg'),
  ('endo', 'إندو موتور', 20, 'endo'),
  ('micro', 'ميكرو موتور', 30, 'micro'),
  ('rotary', 'روتاري', 40, 'rotary'),
  ('contra', 'كونترا', 50, 'contra'),
  ('iocam', 'كاميرا إنترا أورال', 60, 'iocam'),
  ('cam', 'كاميرا', 70, 'cam'),
  ('loupe', 'لوب تكبير', 80, 'loupe'),
  ('cure', 'لايت كيور', 90, 'cure'),
  ('unit', 'يونيت أسنان', 100, 'unit'),
  ('xray', 'أشعة', 110, 'xray'),
  ('autoclave', 'أوتوكلاف', 120, 'autoclave'),
  ('apex', 'أبيكس لوكيتور', 130, 'apex'),
  ('other', 'جهاز تاني', 1000, 'other');
create trigger device_categories_updated_at before update on public.device_categories
  for each row execute function private.set_updated_at();
alter table public.device_categories enable row level security;
create policy device_categories_select on public.device_categories for select to anon, authenticated using (true);
create policy device_categories_insert on public.device_categories for insert to authenticated with check ((select private.is_admin()));
create policy device_categories_update on public.device_categories for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
grant select on public.device_categories to anon, authenticated;
grant insert, update on public.device_categories to authenticated;
grant all on public.device_categories to service_role;

-- enum → text + FK (the view and the stats function depend on the type).
drop view public.public_devices;
drop function public.demand_stats();

alter table public.devices alter column type type text using type::text;
alter table public.seller_submissions alter column device_type type text using device_type::text;
alter table public.device_requests alter column device_type type text using device_type::text;
alter table public.inspections alter column device_type type text using device_type::text;
alter table public.devices add constraint devices_type_fkey foreign key (type) references public.device_categories (id) on update cascade;
alter table public.seller_submissions add constraint seller_submissions_device_type_fkey foreign key (device_type) references public.device_categories (id) on update cascade;
alter table public.device_requests add constraint device_requests_device_type_fkey foreign key (device_type) references public.device_categories (id) on update cascade;
alter table public.inspections add constraint inspections_device_type_fkey foreign key (device_type) references public.device_categories (id) on update cascade;
create index if not exists seller_submissions_device_type_idx on public.seller_submissions (device_type);
create index if not exists device_requests_device_type_idx on public.device_requests (device_type);
create index if not exists inspections_device_type_idx on public.inspections (device_type);
drop type public.device_type;

-- The values of the category's detail fields, by field key: {"memory": "256 GB"}.
alter table public.devices add column specs jsonb not null default '{}'::jsonb check (jsonb_typeof(specs) = 'object');

create view public.public_devices
with (security_invoker = true) as
select
  d.id, d.public_code, d.title, d.type, d.brand, d.model, d.details, d.origin, d.capacity,
  d.manufacture_year, d.accessories, d.condition, d.inspection_state, d.efficiency,
  d.declared_defects, d.has_box, d.repaired_before, d.sale_price, d.maintenance_months,
  d.status, d.featured, d.views, d.published_at, d.created_at,
  d.compare_at_price, d.specs
from public.devices d
where private.device_is_public(d.status, d.archive_at);
grant select on public.public_devices to anon, authenticated;

create or replace function public.demand_stats()
returns table (device_id uuid, public_code text, title text, type text, status public.device_status, views int, saves bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_team() then
    raise exception 'team only' using errcode = '42501';
  end if;
  return query
    select d.id, d.public_code, d.title, d.type, d.status, d.views,
           (select count(*) from public.favorites f where f.device_id = d.id)
    from public.devices d
    where d.status in ('published', 'reserved', 'sold');
end;
$$;
revoke all on function public.demand_stats() from public, anon;
grant execute on function public.demand_stats() to authenticated;

-- Public reports follow the same «still public» rule as the listings.
create or replace view public.public_device_reports
with (security_invoker = true) as
select r.device_id, r.report_code, r.technician_name, r.inspected_at, r.checklist, r.overall_efficiency,
       r.appearance, r.serial_no, r.replaced_parts, r.condition, r.defects, r.report_pdf_key
from public.device_reports r
join public.devices d on d.id = r.device_id
where private.device_is_public(d.status, d.archive_at);
