-- Maintenance per device: 1, 3 or 6 months (client, 5 Nov 2026).
alter table public.devices drop constraint devices_maintenance_months_check;
alter table public.devices add constraint devices_maintenance_months_check check (maintenance_months in (1, 3, 6));
