-- Inspections in the dashboard (control panel step 4). Everything happens at
-- headquarters (ADMIN_SPEC §4); these columns hold what the admin week list shows.
alter table public.inspections
  add column device_type public.device_type,
  add column governorate text,
  add column time_slot text,          -- «الصبح (10 – 1)»
  add column photo_count int not null default 0 check (photo_count >= 0);
