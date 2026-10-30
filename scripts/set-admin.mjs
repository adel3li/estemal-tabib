// Makes an email an admin: right away if the account exists, otherwise on its
// first sign-in. Safe to run against production (it touches nothing else).
//
//   SEED_ADMIN_EMAIL=someone@example.com node scripts/set-admin.mjs
//
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SEED_ADMIN_EMAIL ?? process.argv[2];

if (!url || !key || !email) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SEED_ADMIN_EMAIL.");
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/rpc/set_admin_email`, {
  method: "POST",
  headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({ p_email: email }),
});
if (!res.ok) {
  console.error(`Failed (${res.status}): ${await res.text()}`);
  process.exit(1);
}
console.log(`${email}: ${await res.json()}`);
