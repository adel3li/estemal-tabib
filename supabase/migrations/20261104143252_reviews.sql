-- «آراء العملاء» (client, WhatsApp 3–4 Nov 2026): reviews are sent from the
-- site and published after the team checks them; the team can also add
-- reviews from past customers. Anyone may send one (buyers who ordered on
-- WhatsApp may not have an account) — it always starts as «pending».
create table public.reviews (
  id bigint generated always as identity primary key,
  author_name text not null check (length(trim(author_name)) between 2 and 80),
  role text not null check (role in ('buyer', 'seller')),
  rating smallint not null check (rating between 1 and 5),
  body text not null check (length(trim(body)) between 5 and 1000),
  device text check (device is null or length(device) <= 120),   -- «اشترى أوتوكلاف»
  status text not null default 'pending' check (status in ('pending', 'published', 'hidden')),
  source text not null default 'site' check (source in ('site', 'team')),
  user_id uuid references public.profiles (id) on delete set null,  -- who sent it, if signed in
  reviewed_by uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create index reviews_status_idx on public.reviews (status, published_at desc);
create index reviews_user_idx on public.reviews (user_id);
create index reviews_reviewed_by_idx on public.reviews (reviewed_by);
alter table public.reviews enable row level security;

-- Everyone sees published reviews; the team (admin + marketing) sees all.
create policy reviews_select on public.reviews for select to anon, authenticated
  using (status = 'published' or (select private.is_team()));
create policy reviews_insert on public.reviews for insert to anon, authenticated
  with check (true); -- the guard below forces pending / site / own id for non-team
create policy reviews_update on public.reviews for update to authenticated
  using ((select private.is_team())) with check ((select private.is_team()));
create policy reviews_delete on public.reviews for delete to authenticated
  using ((select private.is_team()));

create or replace function private.reviews_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if private.is_privileged() or private.is_team() then
    if new.status = 'published' and new.published_at is null then new.published_at := now(); end if;
    if tg_op = 'UPDATE' and new.status is distinct from old.status then new.reviewed_by := (select auth.uid()); end if;
    return new;
  end if;
  new.status := 'pending';
  new.source := 'site';
  new.user_id := (select auth.uid());
  new.reviewed_by := null;
  new.published_at := null;
  new.created_at := now();
  return new;
end;
$$;
create trigger reviews_guard before insert or update on public.reviews
  for each row execute function private.reviews_guard();
revoke all on function private.reviews_guard() from public, anon, authenticated;

-- Column grants: the public never reads who sent a review.
grant select (id, author_name, role, rating, body, device, status, source, published_at, created_at) on public.reviews to anon, authenticated;
grant insert (author_name, role, rating, body, device) on public.reviews to anon, authenticated;
grant update (author_name, role, rating, body, device, status) on public.reviews to authenticated;
grant delete on public.reviews to authenticated;
grant all on public.reviews to service_role;
