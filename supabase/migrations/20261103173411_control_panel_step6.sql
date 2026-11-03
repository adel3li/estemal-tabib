-- Control panel step 6 (docs/ADMIN_SPEC.md §3, §7, §8).

-- «الإعدادات»: contact + transfer details shown on the site. One row; everyone
-- reads it (it's public contact info), only admins change it.
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  whatsapp text,          -- official WhatsApp number, 01xxxxxxxxx
  email text,
  instapay text,          -- InstaPay address / number for fees and payments
  vodafone_cash text,
  facebook text,
  instagram text,
  tiktok text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);
insert into public.site_settings (id) values (1);
alter table public.site_settings enable row level security;
create policy site_settings_select on public.site_settings for select to anon, authenticated using (true);
create policy site_settings_update on public.site_settings for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function private.set_updated_at();

-- Customer history (CRM, §7 / open point E): the team writes a short summary
-- of each call / WhatsApp so anyone can pick the customer up.
create table public.customer_notes (
  id bigint generated always as identity primary key,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (length(trim(body)) > 0 and length(body) <= 2000),
  author_id uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index customer_notes_customer_idx on public.customer_notes (customer_id, created_at desc);
create index customer_notes_author_idx on public.customer_notes (author_id);
alter table public.customer_notes enable row level security;
create policy customer_notes_select on public.customer_notes for select to authenticated using ((select private.is_team()));
create policy customer_notes_insert on public.customer_notes for insert to authenticated
  with check ((select private.is_team()) and author_id = (select auth.uid()));
create policy customer_notes_delete on public.customer_notes for delete to authenticated
  using ((select private.is_admin()) or author_id = (select auth.uid()));
grant select, insert, delete on public.customer_notes to authenticated;
grant all on public.customer_notes to service_role;

-- Per-device expenses → net profit (§8, Super Admin only).
create table public.device_expenses (
  id bigint generated always as identity primary key,
  device_id uuid not null references public.devices (id) on delete cascade,
  kind text not null check (kind in ('shipping', 'inspection', 'maintenance', 'other')),
  amount int not null check (amount > 0),
  note text,
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index device_expenses_device_idx on public.device_expenses (device_id);
create index device_expenses_created_by_idx on public.device_expenses (created_by);
alter table public.device_expenses enable row level security;
create policy device_expenses_select on public.device_expenses for select to authenticated using ((select private.is_admin()));
create policy device_expenses_insert on public.device_expenses for insert to authenticated with check ((select private.is_admin()));
create policy device_expenses_delete on public.device_expenses for delete to authenticated using ((select private.is_admin()));
grant select, insert, delete on public.device_expenses to authenticated;
grant all on public.device_expenses to service_role;

-- «مميز» lasts at most 7 days (§3).
alter table public.devices add column featured_until timestamptz;
update public.devices set featured_until = now() + interval '7 days' where featured;
