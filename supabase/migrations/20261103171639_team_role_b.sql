-- Marketing & follow-up team (docs/ADMIN_SPEC.md §1):
--   CAN: see demand / analytics, track orders, update shipping & delivery,
--        see customers' phones, notify «اطلب جهاز» clients.
--   CANNOT: profit, expenses, payments / financial records, sell-request
--        review, inspections («اعتمد ونشّر»), device edits, team roles.

create or replace function private.is_team()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role in ('admin', 'marketing')
  );
$$;
revoke all on function private.is_team() from public;
grant execute on function private.is_team() to anon, authenticated, service_role;

-- Customers' phones.
drop policy profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_team()));

-- «اطلب جهاز»: read + mark notified/closed.
drop policy device_requests_select on public.device_requests;
create policy device_requests_select on public.device_requests for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_team()));
drop policy device_requests_update on public.device_requests;
create policy device_requests_update on public.device_requests for update to authenticated
  using (user_id = (select auth.uid()) or (select private.is_team()))
  with check (user_id = (select auth.uid()) or (select private.is_team()));

create or replace function private.device_requests_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if private.is_privileged() or private.is_team() then
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

-- Orders: read all; update tracking only (guard below). Creating, money,
-- cancelling and paying the seller stay with admins.
drop policy orders_select on public.orders;
create policy orders_select on public.orders for select to authenticated
  using (buyer_id = (select auth.uid()) or (select private.is_team()));
drop policy orders_update on public.orders;
create policy orders_update on public.orders for update to authenticated
  using ((select private.is_team())) with check ((select private.is_team()));

drop policy order_events_select on public.order_events;
create policy order_events_select on public.order_events for select to authenticated
  using (
    (select private.is_team())
    or exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = (select auth.uid()))
  );
drop policy order_events_insert on public.order_events;
create policy order_events_insert on public.order_events for insert to authenticated
  with check ((select private.is_team()) and (actor_id is null or actor_id = (select auth.uid())));

-- What the marketing team may change on an order: courier, tracking number,
-- expected date, where the device is, and the shipping → «الاستلام» →
-- «فترة الضمان» moves (with the receipt time).
create or replace function private.orders_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  n public.orders;
begin
  if private.is_privileged() or private.is_admin() then
    return new;
  end if;
  if not (old.status = new.status
          or (old.status = 'shipping' and new.status = 'delivered')
          or (old.status = 'delivered' and new.status = 'trial')) then
    raise exception 'only the admin can move an order to this step' using errcode = '42501';
  end if;
  n := new;
  n.status := old.status;
  n.shipping_company := old.shipping_company;
  n.tracking_no := old.tracking_no;
  n.eta := old.eta;
  n.device_location := old.device_location;
  n.delivered_at := old.delivered_at;
  n.trial_ends_at := old.trial_ends_at;
  n.updated_at := old.updated_at;
  if n is distinct from old then
    raise exception 'only the admin can change this' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger orders_guard before update on public.orders
  for each row execute function private.orders_guard();

-- The listing follows its order (whoever moves it): ordered → «محجوز»,
-- received → «تم البيع» until the warranty ends (then it archives itself),
-- cancelled / returned → back on sale (ADMIN_SPEC §3).
create or replace function private.orders_device_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.devices set status = 'reserved' where id = new.device_id and status = 'published';
  elsif new.status is distinct from old.status then
    if new.status = 'trial' then
      update public.devices set status = 'sold', archive_at = coalesce(new.trial_ends_at, now() + interval '3 days')
      where id = new.device_id;
    elsif new.status in ('cancelled_refunded', 'returned') then
      update public.devices set status = 'published', archive_at = null
      where id = new.device_id and status in ('reserved', 'sold');
    end if;
  end if;
  return null;
end;
$$;
create trigger orders_device_status after insert or update of status on public.orders
  for each row execute function private.orders_device_status();
revoke all on function private.orders_guard() from public, anon, authenticated;
revoke all on function private.orders_device_status() from public, anon, authenticated;
revoke all on function private.device_requests_guard() from public, anon, authenticated;

-- «الأكثر طلباً» (open point B): views are counted when someone opens a
-- public device page; saves come from favorites.
create or replace function public.count_device_view(p_code text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.devices set views = views + 1
  where public_code = p_code and private.device_is_public(status, archive_at);
$$;
revoke all on function public.count_device_view(text) from public;
grant execute on function public.count_device_view(text) to anon, authenticated;

create or replace function public.demand_stats()
returns table (device_id uuid, public_code text, title text, type public.device_type, status public.device_status, views int, saves bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_team() then
    raise exception 'team only' using errcode = '42501';
  end if;
  return query
    select d.id, d.public_code, d.title, d.type, d.status, d.views,
           (select count(*) from public.favorites f where f.device_id = d.id)
    from public.devices d
    where d.status in ('published', 'reserved', 'sold');
end;
$$;
revoke all on function public.demand_stats() from public, anon;
grant execute on function public.demand_stats() to authenticated;

-- Team members are added / removed from the dashboard by an admin (open point A).
-- The person signs in once first (so they have an account).
create or replace function public.set_team_role(p_email text, p_role public.user_role)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  e text := lower(trim(p_email));
  who public.profiles;
begin
  if not private.is_admin() then
    raise exception 'admins only' using errcode = '42501';
  end if;
  select * into who from public.profiles where lower(email) = e;
  if who.id is null then
    raise exception 'no account with this email' using errcode = 'P0002';
  end if;
  if who.id = (select auth.uid()) then
    raise exception 'you can''t change your own role' using errcode = '42501';
  end if;
  update public.profiles set role = p_role where id = who.id;
  return coalesce(who.full_name, who.email);
end;
$$;
revoke all on function public.set_team_role(text, public.user_role) from public, anon;
grant execute on function public.set_team_role(text, public.user_role) to authenticated;
