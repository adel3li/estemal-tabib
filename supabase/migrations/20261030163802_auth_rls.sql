-- Auth helpers, profile trigger, guards, RLS policies, grants and public views
-- (PHASE1_PROMPT.md §6–§7).
--
-- This project has "automatically expose new tables" OFF, so nothing is reachable
-- through the Data API until it is GRANTed below. The project's default privileges
-- also hand anon/authenticated TRUNCATE/REFERENCES/TRIGGER on new tables; RLS does
-- not cover TRUNCATE, so we revoke everything first and grant only what is needed.

-- ── Admin bootstrap ──────────────────────────────────────────────────────────
-- Emails that become admin on first sign-in (filled by public.set_admin_email,
-- which only the service role can call — see scripts/set-admin.mjs).
create table private.admin_emails (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);
alter table private.admin_emails enable row level security; -- no policies: nobody via API

-- ── is_admin() ───────────────────────────────────────────────────────────────
-- SECURITY DEFINER so policies can read profiles.role without recursing into
-- profiles' own RLS. Lives in `private` (not exposed by the Data API).
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

-- True for server-side roles (service_role, postgres, …) — i.e. not an API user.
create or replace function private.is_privileged()
returns boolean
language sql
stable
set search_path = ''
as $$
  select current_user not in ('anon', 'authenticated');
$$;

-- ── Profile row on sign-up ───────────────────────────────────────────────────
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    lower(new.email),
    nullif(coalesce(meta ->> 'full_name', meta ->> 'name'), ''),
    case
      when exists (select 1 from private.admin_emails a where a.email = lower(new.email))
        then 'admin'::public.user_role
      else 'user'::public.user_role
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Keep profiles.email in sync if the user changes their email.
create or replace function private.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = lower(new.email) where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function private.handle_user_email_change();

-- ── Service-role helper: make an email admin (now or on first sign-in) ──────
create or replace function public.set_admin_email(p_email text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  e text := lower(trim(p_email));
  n int;
begin
  if e is null or e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid email';
  end if;
  insert into private.admin_emails (email) values (e) on conflict do nothing;
  update public.profiles set role = 'admin' where lower(email) = e;
  get diagnostics n = row_count;
  return case when n > 0 then 'admin now' else 'admin on first sign-in' end;
end;
$$;
revoke all on function public.set_admin_email(text) from public, anon, authenticated;
grant execute on function public.set_admin_email(text) to service_role;

-- ── Guards: what a non-admin may change ──────────────────────────────────────
-- profiles: users edit their own details, never role / phone_verified / email.
create or replace function private.profiles_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if private.is_privileged() or private.is_admin() then
    return new;
  end if;
  if new.id is distinct from old.id
     or new.role is distinct from old.role
     or new.phone_verified is distinct from old.phone_verified
     or new.email is distinct from old.email
     or new.created_at is distinct from old.created_at then
    raise exception 'you can''t change this field' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger profiles_guard before update on public.profiles
  for each row execute function private.profiles_guard();

-- seller_submissions: on insert, workflow fields start at their defaults; after
-- that the owner may only add/change the fee transfer reference while unpaid.
create or replace function private.seller_submissions_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  n public.seller_submissions;
begin
  if private.is_privileged() or private.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.fee_status := 'pending';
    new.status := 'new';
    new.reject_reason := null;
    new.admin_log := '[]'::jsonb;
    new.device_id := null;
    return new;
  end if;
  n := new;
  n.fee_reference := old.fee_reference;
  n.updated_at := old.updated_at;
  if n is distinct from old or old.fee_status <> 'pending' then
    raise exception 'only the transfer reference can be changed' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger seller_submissions_guard before insert or update on public.seller_submissions
  for each row execute function private.seller_submissions_guard();

-- device_requests: the owner edits their request; status is the team's.
create or replace function private.device_requests_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if private.is_privileged() or private.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.status := 'new';
    new.notified_at := null;
    return new;
  end if;
  if new.status is distinct from old.status
     or new.notified_at is distinct from old.notified_at
     or new.public_code is distinct from old.public_code
     or new.user_id is distinct from old.user_id then
    raise exception 'you can''t change this field' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger device_requests_guard before insert or update on public.device_requests
  for each row execute function private.device_requests_guard();

-- Trigger/helper functions are not API endpoints.
revoke all on all functions in schema private from public, anon, authenticated;
grant usage on schema private to anon, authenticated, service_role;
grant execute on function private.is_admin() to anon, authenticated, service_role;
grant execute on function private.is_privileged() to anon, authenticated, service_role;

-- ── Public inspection report snapshot ────────────────────────────────────────
-- `inspections` is admin-only (it has scheduling data such as where the device
-- is). «اعتمد ونشّر» copies the approved, public part of the report here.
create table public.device_reports (
  device_id uuid primary key references public.devices (id) on delete cascade,
  inspection_id uuid references public.inspections (id) on delete set null,
  report_code text,
  technician_name text,
  inspected_at timestamptz,
  checklist jsonb not null default '[]'::jsonb,
  overall_efficiency text,
  appearance text,
  serial_no text,
  replaced_parts text,
  condition public.device_condition,
  defects text,
  report_pdf_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint device_reports_checklist_is_array check (jsonb_typeof(checklist) = 'array')
);
create index device_reports_inspection_idx on public.device_reports (inspection_id);
create trigger device_reports_updated_at before update on public.device_reports
  for each row execute function private.set_updated_at();

-- ── Row level security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.device_private enable row level security;
alter table public.device_media enable row level security;
alter table public.device_reports enable row level security;
alter table public.inspections enable row level security;
alter table public.seller_submissions enable row level security;
alter table public.submission_media enable row level security;
alter table public.device_requests enable row level security;
alter table public.favorites enable row level security;
alter table public.audit_log enable row level security;
alter table public.orders enable row level security;
alter table public.order_events enable row level security;
alter table public.payments enable row level security;

-- One permissive policy per table/action so the planner (and the advisor) stay happy.

-- profiles: own row; admins all. No insert/delete via API (the trigger inserts).
create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()))
  with check (id = (select auth.uid()) or (select private.is_admin()));

-- devices: public statuses for everyone; admins see and write everything.
create policy devices_select on public.devices for select to anon, authenticated
  using (status in ('published', 'reserved', 'sold') or (select private.is_admin()));
create policy devices_insert on public.devices for insert to authenticated
  with check ((select private.is_admin()));
create policy devices_update on public.devices for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy devices_delete on public.devices for delete to authenticated
  using ((select private.is_admin()));

-- device_private, inspections, audit_log: admins only.
create policy device_private_admin on public.device_private for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy inspections_admin on public.inspections for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy audit_log_select on public.audit_log for select to authenticated
  using ((select private.is_admin()));
create policy audit_log_insert on public.audit_log for insert to authenticated
  with check ((select private.is_admin()) and actor_id = (select auth.uid()));

-- device_media / device_reports: public when the device is public; admin write.
create policy device_media_select on public.device_media for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (select 1 from public.devices d
               where d.id = device_id and d.status in ('published', 'reserved', 'sold'))
  );
create policy device_media_insert on public.device_media for insert to authenticated
  with check ((select private.is_admin()));
create policy device_media_update on public.device_media for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy device_media_delete on public.device_media for delete to authenticated
  using ((select private.is_admin()));

create policy device_reports_select on public.device_reports for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (select 1 from public.devices d
               where d.id = device_id and d.status in ('published', 'reserved', 'sold'))
  );
create policy device_reports_insert on public.device_reports for insert to authenticated
  with check ((select private.is_admin()));
create policy device_reports_update on public.device_reports for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy device_reports_delete on public.device_reports for delete to authenticated
  using ((select private.is_admin()));

-- seller_submissions: owner inserts/reads own (+ fee reference via guard); admins all.
create policy seller_submissions_select on public.seller_submissions for select to authenticated
  using (seller_id = (select auth.uid()) or (select private.is_admin()));
create policy seller_submissions_insert on public.seller_submissions for insert to authenticated
  with check (seller_id = (select auth.uid()) or (select private.is_admin()));
create policy seller_submissions_update on public.seller_submissions for update to authenticated
  using (seller_id = (select auth.uid()) or (select private.is_admin()))
  with check (seller_id = (select auth.uid()) or (select private.is_admin()));
create policy seller_submissions_delete on public.seller_submissions for delete to authenticated
  using ((select private.is_admin()));

-- submission_media: owner of the submission inserts/reads; admins all.
create policy submission_media_select on public.submission_media for select to authenticated
  using (
    (select private.is_admin())
    or exists (select 1 from public.seller_submissions s
               where s.id = submission_id and s.seller_id = (select auth.uid()))
  );
create policy submission_media_insert on public.submission_media for insert to authenticated
  with check (
    (select private.is_admin())
    or exists (select 1 from public.seller_submissions s
               where s.id = submission_id and s.seller_id = (select auth.uid()) and s.status = 'new')
  );
create policy submission_media_update on public.submission_media for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy submission_media_delete on public.submission_media for delete to authenticated
  using ((select private.is_admin()));

-- device_requests: owner CRUD own; admins all (they mark «notified»).
create policy device_requests_select on public.device_requests for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy device_requests_insert on public.device_requests for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy device_requests_update on public.device_requests for update to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()))
  with check (user_id = (select auth.uid()) or (select private.is_admin()));
create policy device_requests_delete on public.device_requests for delete to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

-- favorites: owner CRUD own; admins read all.
create policy favorites_select on public.favorites for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy favorites_insert on public.favorites for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy favorites_delete on public.favorites for delete to authenticated
  using (user_id = (select auth.uid()));

-- Phase 2: buyers read their own orders/events/payments; admins all.
create policy orders_select on public.orders for select to authenticated
  using (buyer_id = (select auth.uid()) or (select private.is_admin()));
create policy orders_insert on public.orders for insert to authenticated
  with check ((select private.is_admin()));
create policy orders_update on public.orders for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy orders_delete on public.orders for delete to authenticated
  using ((select private.is_admin()));

create policy order_events_select on public.order_events for select to authenticated
  using (
    (select private.is_admin())
    or exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = (select auth.uid()))
  );
create policy order_events_insert on public.order_events for insert to authenticated
  with check ((select private.is_admin()));

create policy payments_select on public.payments for select to authenticated
  using (payer_id = (select auth.uid()) or (select private.is_admin()));
create policy payments_insert on public.payments for insert to authenticated
  with check ((select private.is_admin()));
create policy payments_update on public.payments for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- ── Public views (explicit column lists, security_invoker = RLS of the caller) ──
create view public.public_devices
with (security_invoker = true) as
select
  d.id, d.public_code, d.title, d.type, d.brand, d.model, d.details, d.origin, d.capacity,
  d.manufacture_year, d.accessories, d.condition, d.inspection_state, d.efficiency,
  d.declared_defects, d.has_box, d.repaired_before, d.sale_price, d.maintenance_months,
  d.status, d.featured, d.views, d.published_at, d.created_at
  -- not exposed to buyers: governorate (device location), source
from public.devices d
where d.status in ('published', 'reserved', 'sold');

create view public.public_device_reports
with (security_invoker = true) as
select
  r.device_id, r.report_code, r.technician_name, r.inspected_at, r.checklist,
  r.overall_efficiency, r.appearance, r.serial_no, r.replaced_parts, r.condition,
  r.defects, r.report_pdf_key
from public.device_reports r
join public.devices d on d.id = r.device_id
where d.status in ('published', 'reserved', 'sold');

-- ── Grants ───────────────────────────────────────────────────────────────────
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- service_role (server-side only) bypasses RLS but still needs table privileges.
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

-- anon: public catalogue only.
grant select on public.devices, public.device_media, public.device_reports to anon;
grant select on public.public_devices, public.public_device_reports to anon;

-- authenticated: RLS + guards decide rows; these are the verbs the app uses.
grant select on public.public_devices, public.public_device_reports to authenticated;
grant select, insert, update, delete on
  public.devices, public.device_private, public.device_media, public.device_reports,
  public.inspections, public.seller_submissions, public.submission_media,
  public.device_requests, public.orders, public.payments
  to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select, insert on public.audit_log, public.order_events to authenticated;

-- Inserting a row draws its public code from these.
grant usage on sequence
  public.device_code_seq, public.submission_code_seq, public.inspection_code_seq,
  public.request_code_seq, public.order_code_seq
  to authenticated;
