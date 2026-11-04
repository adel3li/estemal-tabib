-- Quantity (client, WhatsApp 4 Nov 2026): "we may have 10 of the same device
-- with the same specs — list it once, show we have several, and a buyer can
-- order more than one".
--   devices.quantity  = units we have
--   devices.available = units not taken by an open order (kept by the database)
--   orders.quantity   = units in this order (orders.price is the total)
alter table public.devices
  add column quantity int not null default 1 check (quantity between 1 and 999),
  add column available int not null default 1 check (available >= 0);
alter table public.orders add column quantity int not null default 1 check (quantity between 1 and 999);

-- Recompute the listing's stock and status from its orders:
--   units free          → «منشور»
--   all units taken     → «محجوز»
--   all units received  → «تم البيع» until the last warranty ends (then archived)
-- Drafts / hidden listings keep their status (only the count moves).
create or replace function private.refresh_device_stock(p_device uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.devices;
  taken int;
  received int;
  last_trial timestamptz;
begin
  select * into d from public.devices where id = p_device for update;
  if d.id is null then return; end if;
  select coalesce(sum(quantity) filter (where status not in ('cancelled_refunded', 'returned', 'replaced')), 0),
         coalesce(sum(quantity) filter (where status in ('trial', 'released_to_seller')), 0),
         max(trial_ends_at) filter (where status in ('trial', 'released_to_seller'))
    into taken, received, last_trial
    from public.orders where device_id = p_device;
  update public.devices set available = greatest(d.quantity - taken, 0) where id = p_device;
  if d.status in ('draft', 'hidden') then return; end if;
  if taken < d.quantity then
    update public.devices set status = 'published', archive_at = null where id = p_device and status <> 'published';
  elsif received >= d.quantity then
    update public.devices set status = 'sold', archive_at = coalesce(last_trial, now() + interval '3 days') where id = p_device;
  else
    update public.devices set status = 'reserved', archive_at = null where id = p_device and status <> 'reserved';
  end if;
end;
$$;
revoke all on function private.refresh_device_stock(uuid) from public, anon, authenticated;

-- Replaces the one-unit trigger from the team-role migration.
create or replace function private.orders_device_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op in ('INSERT', 'UPDATE') then perform private.refresh_device_stock(new.device_id); end if;
  if tg_op = 'UPDATE' and new.device_id is distinct from old.device_id then perform private.refresh_device_stock(old.device_id); end if;
  if tg_op = 'DELETE' then perform private.refresh_device_stock(old.device_id); end if;
  return null;
end;
$$;
drop trigger orders_device_status on public.orders;
create trigger orders_device_status after insert or delete or update of status, quantity, device_id on public.orders
  for each row execute function private.orders_device_status();

-- Changing the quantity (or publishing) recounts too.
create or replace function private.devices_stock_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.refresh_device_stock(new.id);
  return null;
end;
$$;
revoke all on function private.devices_stock_changed() from public, anon, authenticated;
create trigger devices_stock_changed after insert or update of quantity on public.devices
  for each row execute function private.devices_stock_changed();

-- Existing listings: 1 unit; available = 0 if an open order has it.
update public.devices d set available = case when exists (
  select 1 from public.orders o where o.device_id = d.id and o.status not in ('cancelled_refunded', 'returned', 'replaced')
) then 0 else 1 end;

-- Public view gets the counts.
create or replace view public.public_devices
with (security_invoker = true) as
select
  d.id, d.public_code, d.title, d.type, d.brand, d.model, d.details, d.origin, d.capacity,
  d.manufacture_year, d.accessories, d.condition, d.inspection_state, d.efficiency,
  d.declared_defects, d.has_box, d.repaired_before, d.sale_price, d.maintenance_months,
  d.status, d.featured, d.views, d.published_at, d.created_at,
  d.compare_at_price, d.specs, d.quantity, d.available
from public.devices d
where private.device_is_public(d.status, d.archive_at);
