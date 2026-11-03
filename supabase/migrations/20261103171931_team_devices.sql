-- The marketing team reads every listing (drafts and archived «تم البيع» too)
-- so orders and demand keep their device; private data (device_private) stays admin-only.
drop policy devices_select on public.devices;
create policy devices_select on public.devices for select to anon, authenticated
  using (private.device_is_public(status, archive_at) or (select private.is_team()));
