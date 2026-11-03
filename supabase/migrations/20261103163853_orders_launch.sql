-- Orders & payments at launch (docs/ADMIN_SPEC.md §5, §8, §9 — control panel step 3).
-- Orders are entered by the team (buyers order on WhatsApp), so the buyer may
-- not have an account yet: buyer_id becomes optional; the contact lives in
-- delivery_name / delivery_phone / delivery_governorate / delivery_address.

alter table public.orders alter column buyer_id drop not null;
alter table public.orders
  add column payment_method text check (payment_method in ('instapay', 'vodafone_cash', 'cod')),
  add column shipping_company text,
  add column tracking_no text,
  add column eta date,
  add column device_location text,      -- «عند البايع» / «في المقر» / «مع شركة الشحن» / «عند المشتري»
  add column delivered_at timestamptz,  -- actual receipt: starts the warranty (marked by hand)
  add column closed_at timestamptz;

-- payments.method: same values (+ older free text stays readable).
comment on column public.payments.method is 'instapay | vodafone_cash | cod';

-- «تم البيع» shows for the warranty window, then the listing archives itself.
alter table public.devices add column archive_at timestamptz;

-- Public = published / reserved / sold-and-not-yet-archived.
create or replace function private.device_is_public(s public.device_status, archive_at timestamptz)
returns boolean
language sql
stable
set search_path = ''
as $$
  select s in ('published', 'reserved') or (s = 'sold' and (archive_at is null or archive_at > now()));
$$;
revoke all on function private.device_is_public(public.device_status, timestamptz) from public;
grant execute on function private.device_is_public(public.device_status, timestamptz) to anon, authenticated;

drop policy devices_select on public.devices;
create policy devices_select on public.devices for select to anon, authenticated
  using (private.device_is_public(status, archive_at) or (select private.is_admin()));

drop policy device_media_select on public.device_media;
create policy device_media_select on public.device_media for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (select 1 from public.devices d
               where d.id = device_id and private.device_is_public(d.status, d.archive_at))
  );

drop policy device_reports_select on public.device_reports;
create policy device_reports_select on public.device_reports for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (select 1 from public.devices d
               where d.id = device_id and private.device_is_public(d.status, d.archive_at))
  );

-- The buyer answers the inspection report from the tracker page: accept →
-- shipping, reject → cancelled (money back in full, terms). Only their own
-- order, only while it waits on the report.
create or replace function public.buyer_report_decision(p_order uuid, p_accept boolean)
returns public.order_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  o public.orders;
  v_next public.order_status;
begin
  select * into o from public.orders where id = p_order for update;
  if o.id is null or o.buyer_id is distinct from (select auth.uid()) then
    raise exception 'order not found' using errcode = '42501';
  end if;
  if o.status <> 'inspection_report' then
    raise exception 'this order is not waiting for your answer' using errcode = '22023';
  end if;
  v_next := case when p_accept then 'shipping'::public.order_status else 'cancelled_refunded'::public.order_status end;
  update public.orders set status = v_next, closed_at = case when p_accept then null else now() end where id = o.id;
  insert into public.order_events (order_id, status, note, actor_id)
  values (o.id, v_next,
          case when p_accept then 'المشتري أكّد تقرير الفحص · الطلب اتحرك لخطوة «الشحن»'
               else 'المشتري رفض تقرير الفحص · الطلب اتلغى والفلوس هترجع كاملة' end,
          (select auth.uid()));
  if not p_accept then
    update public.devices set status = 'published' where id = o.device_id and status = 'reserved';
  end if;
  return v_next;
end;
$$;
revoke all on function public.buyer_report_decision(uuid, boolean) from public, anon;
grant execute on function public.buyer_report_decision(uuid, boolean) to authenticated;

create index if not exists orders_status_idx on public.orders (status, created_at desc);

create or replace view public.public_devices
with (security_invoker = true) as
select
  d.id, d.public_code, d.title, d.type, d.brand, d.model, d.details, d.origin, d.capacity,
  d.manufacture_year, d.accessories, d.condition, d.inspection_state, d.efficiency,
  d.declared_defects, d.has_box, d.repaired_before, d.sale_price, d.maintenance_months,
  d.status, d.featured, d.views, d.published_at, d.created_at,
  d.compare_at_price
from public.devices d
where private.device_is_public(d.status, d.archive_at);
