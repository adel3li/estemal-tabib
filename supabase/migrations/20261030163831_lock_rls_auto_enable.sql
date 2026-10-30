-- Security advisor: Supabase's "automatic RLS" event-trigger helper lives in
-- public and was callable by anon/authenticated via /rest/v1/rpc/rls_auto_enable.
-- Event triggers don't need EXECUTE at run time, so revoking it changes nothing else.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
