-- Marketing & follow-up team (docs/ADMIN_SPEC.md §1). Its own migration: a new
-- enum value can't be used in the transaction that adds it.
alter type public.user_role add value if not exists 'marketing';
