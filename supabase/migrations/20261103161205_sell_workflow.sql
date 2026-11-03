-- Sell-request workflow from the client's answers (docs/ADMIN_SPEC.md §2):
-- no payment at submission; after acceptance the admin sets the fee for this
-- device and asks for it; the listing is published when it arrives.
-- The 3-day no-reply rule counts from OUR FIRST message to the seller.
alter table public.seller_submissions
  add column fee_amount int check (fee_amount is null or fee_amount > 0),
  add column fee_requested_at timestamptz,
  add column first_contact_at timestamptz,
  add column seller_replied_at timestamptz;

-- Account flag (§7): suspicious accounts aren't blocked; their requests go to a
-- separate «مشبوه» list in the dashboard.
alter table public.profiles add column trust text check (trust in ('serious', 'suspicious'));

-- Only the team may set the flag.
create or replace function private.profiles_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if private.is_privileged() or private.is_admin() then
    return new;
  end if;
  if new.id is distinct from old.id
     or new.role is distinct from old.role
     or new.phone_verified is distinct from old.phone_verified
     or new.email is distinct from old.email
     or new.trust is distinct from old.trust
     or new.created_at is distinct from old.created_at then
    raise exception 'you can''t change this field' using errcode = '42501';
  end if;
  return new;
end;
$$;

-- New sell requests from sellers can't set these themselves (the guard resets
-- workflow fields on insert; extend it to the new ones).
create or replace function private.seller_submissions_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  n public.seller_submissions;
begin
  if private.is_privileged() or private.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.fee_status := 'pending';
    new.status := 'new';
    new.reject_reason := null;
    new.admin_log := '[]'::jsonb;
    new.device_id := null;
    new.fee_amount := null;
    new.fee_requested_at := null;
    new.first_contact_at := null;
    new.seller_replied_at := null;
    return new;
  end if;
  n := new;
  n.fee_reference := old.fee_reference;
  n.updated_at := old.updated_at;
  if n is distinct from old or old.fee_status <> 'pending' then
    raise exception 'only the transfer reference can be changed' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function private.profiles_guard() from public, anon, authenticated;
revoke all on function private.seller_submissions_guard() from public, anon, authenticated;
