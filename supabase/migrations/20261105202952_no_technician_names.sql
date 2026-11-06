-- No technician names anywhere public (client, 5 Nov 2026): inspections are an
-- internal process. The name stays only on public.inspections (admins only).
update public.device_reports set technician_name = null where technician_name is not null;

create or replace function private.device_reports_no_technician() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.technician_name := null;
  return new;
end $$;

create trigger device_reports_no_technician before insert or update on public.device_reports
  for each row execute function private.device_reports_no_technician();

comment on column public.device_reports.technician_name is 'Always null — technician names are internal (public.inspections.technician_name)';

drop view public.public_device_reports;
create view public.public_device_reports
with (security_invoker = true) as
select r.device_id, r.report_code, r.inspected_at, r.checklist, r.overall_efficiency,
       r.appearance, r.serial_no, r.replaced_parts, r.condition, r.defects, r.report_pdf_key
from public.device_reports r
join public.devices d on d.id = r.device_id
where private.device_is_public(d.status, d.archive_at);
grant select on public.public_device_reports to anon, authenticated;
