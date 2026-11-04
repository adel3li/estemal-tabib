-- Recount a listing only when its quantity really changes (the admin editor
-- sends every column on each save, and a status set by hand must stay).
-- New listings simply start with everything available.
drop trigger devices_stock_changed on public.devices;
create trigger devices_stock_changed after update of quantity on public.devices
  for each row when (old.quantity is distinct from new.quantity)
  execute function private.devices_stock_changed();

create or replace function private.devices_new_stock()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.available := new.quantity;
  return new;
end;
$$;
revoke all on function private.devices_new_stock() from public, anon, authenticated;
create trigger devices_new_stock before insert on public.devices
  for each row execute function private.devices_new_stock();
