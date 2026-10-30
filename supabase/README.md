# Database

- `migrations/` — schema, Phase 2 skeleton, RLS/grants/views. Already applied to the project.
- `seed/demo.sql` — demo data (devices, submissions, requests). **Not for production.** Opt-in with `set app.allow_demo_seed = 'on';`.
- `npm run db:set-admin` — make `SEED_ADMIN_EMAIL` an admin (safe on production).
- `npm run db:test-rls` — RLS checks against the real API (creates and deletes throwaway users).

Node in the Claude sandbox needs `NODE_USE_ENV_PROXY=1` for the scripts to reach Supabase.

## Supabase free project paused?

Free projects pause after about a week with no traffic. Supabase dashboard → the project → **Restore project**. Data is kept.
