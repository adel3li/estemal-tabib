-- «السعر قبل الخصم» (client, Nov 2026): optional old price shown crossed out;
-- devices that have one appear in the home page «فرصة متتفوتش» row.
alter table public.devices
  add column compare_at_price int
  constraint devices_compare_at_price_above_sale check (compare_at_price is null or compare_at_price > sale_price);

-- Public view: same columns as before + compare_at_price (added at the end).
create or replace view public.public_devices
with (security_invoker = true) as
select
  d.id, d.public_code, d.title, d.type, d.brand, d.model, d.details, d.origin, d.capacity,
  d.manufacture_year, d.accessories, d.condition, d.inspection_state, d.efficiency,
  d.declared_defects, d.has_box, d.repaired_before, d.sale_price, d.maintenance_months,
  d.status, d.featured, d.views, d.published_at, d.created_at,
  d.compare_at_price
from public.devices d
where d.status in ('published', 'reserved', 'sold');
