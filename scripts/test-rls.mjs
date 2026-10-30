// RLS tests through the real Data API (PHASE1_PROMPT.md §7 "write tests for them").
//
//   node scripts/test-rls.mjs
//
// Needs NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
// Creates three throwaway users (@example.com, no emails are sent — sessions come
// from the admin API) plus two fixture devices, runs the checks, then deletes them.
// Safe on production: it only removes what it created.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anonKey || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const service = createClient(url, serviceKey, opts);
const anon = createClient(url, anonKey, opts);
const tag = `rls-${Date.now()}`;

let failed = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `  — ${detail}`}`);
  if (!ok) failed++;
}
const denied = (r) => Boolean(r.error) || (Array.isArray(r.data) && r.data.length === 0) || r.data === null;

async function makeUser(label, admin = false) {
  const email = `${tag}-${label}@example.com`;
  const { data, error } = await service.auth.admin.createUser({ email, email_confirm: true });
  if (error) throw error;
  if (admin) {
    const up = await service.from("profiles").update({ role: "admin" }).eq("id", data.user.id);
    if (up.error) throw up.error;
  }
  const link = await service.auth.admin.generateLink({ type: "magiclink", email });
  if (link.error) throw link.error;
  const client = createClient(url, anonKey, opts);
  const v = await client.auth.verifyOtp({ email, token: link.data.properties.email_otp, type: "email" });
  if (v.error) throw v.error;
  return { id: data.user.id, email, client };
}

const created = { users: [], devices: [] };

async function main() {
  // ── Fixtures ─────────────────────────────────────────────────────────────
  const a = await makeUser("a");
  const b = await makeUser("b");
  const admin = await makeUser("admin", true);
  created.users.push(a.id, b.id, admin.id);

  const dev = await service
    .from("devices")
    .insert([
      { title: `${tag} published`, type: "apex", condition: "a", sale_price: 1000, status: "published", governorate: "القاهرة" },
      { title: `${tag} draft`, type: "apex", condition: "a", sale_price: 1000, status: "draft" },
    ])
    .select("id, status");
  if (dev.error) throw dev.error;
  const pub = dev.data.find((d) => d.status === "published").id;
  const draft = dev.data.find((d) => d.status === "draft").id;
  created.devices.push(pub, draft);
  await service.from("device_private").insert({ device_id: pub, purchase_cost: 500, sale_reason: "secret", seller_id: a.id });
  await service.from("device_reports").insert({ device_id: pub, technician_name: "[اسم الفني]" });
  await service.from("device_reports").insert({ device_id: draft, technician_name: "[اسم الفني]" });
  await service.from("inspections").insert({ device_id: pub, status: "done", location: "عند البايع" });
  await service.from("audit_log").insert({ entity: "device", entity_id: pub, action: "test" });

  // ── anon ─────────────────────────────────────────────────────────────────
  console.log("\nanon (not signed in)");
  let r = await anon.from("devices").select("id").in("id", [pub, draft]);
  check("sees the published device, not the draft", !r.error && r.data.length === 1 && r.data[0].id === pub, r.error?.message);
  r = await anon.from("public_devices").select("*").in("id", [pub, draft]);
  check("public_devices view: published only, no governorate column",
    !r.error && r.data.length === 1 && !("governorate" in r.data[0]), r.error?.message);
  r = await anon.from("public_device_reports").select("device_id").in("device_id", [pub, draft]);
  check("public report only for the published device", !r.error && r.data.length === 1, r.error?.message);
  for (const t of ["device_private", "inspections", "audit_log", "profiles", "seller_submissions", "submission_media", "device_requests", "favorites", "orders", "payments"]) {
    r = await anon.from(t).select("*").limit(1);
    check(`can't read ${t}`, denied(r), JSON.stringify(r.data));
  }
  r = await anon.from("devices").insert({ title: "x", type: "apex", condition: "a", sale_price: 1 });
  check("can't insert a device", Boolean(r.error));
  r = await anon.rpc("set_admin_email", { p_email: "x@example.com" });
  check("can't call set_admin_email", Boolean(r.error));

  // ── signed-in user ───────────────────────────────────────────────────────
  console.log("\nuser A (signed in, not admin)");
  r = await a.client.from("profiles").select("id, role");
  check("reads only own profile", !r.error && r.data.length === 1 && r.data[0].id === a.id && r.data[0].role === "user", r.error?.message);
  r = await a.client.from("profiles").update({ full_name: "د. تجربة", phone: "01000000000" }).eq("id", a.id).select();
  check("updates own name/phone", !r.error && r.data.length === 1, r.error?.message);
  r = await a.client.from("profiles").update({ role: "admin" }).eq("id", a.id).select();
  check("can't make self admin", Boolean(r.error));
  r = await a.client.from("profiles").update({ phone_verified: true }).eq("id", a.id).select();
  check("can't mark own phone verified", Boolean(r.error));
  r = await a.client.from("profiles").update({ full_name: "hacked" }).eq("id", b.id).select();
  check("can't update another user's profile", denied(r));

  for (const t of ["device_private", "inspections", "audit_log"]) {
    r = await a.client.from(t).select("*").limit(1);
    check(`can't read ${t}`, denied(r), JSON.stringify(r.data));
  }
  r = await a.client.from("devices").select("id").in("id", [pub, draft]);
  check("doesn't see draft devices", !r.error && r.data.length === 1);
  r = await a.client.from("devices").insert({ title: "x", type: "apex", condition: "a", sale_price: 1 }).select();
  check("can't insert a device", Boolean(r.error));
  r = await a.client.from("devices").update({ sale_price: 1 }).eq("id", pub).select();
  check("can't change a device", denied(r));

  const subRow = {
    seller_id: a.id, full_name: "د. تجربة", phone: "01000000000", governorate: "القاهرة",
    pickup_address: "x", device_type: "apex", condition: "a", sale_price: 1000,
  };
  r = await a.client.from("seller_submissions").insert({ ...subRow, fee_status: "paid", status: "accepted" }).select().single();
  check("submits a device; fee/status forced to pending/new",
    !r.error && r.data.fee_status === "pending" && r.data.status === "new" && r.data.public_code.startsWith("#"), r.error?.message);
  const subId = r.data?.id;
  r = await a.client.from("seller_submissions").update({ fee_reference: "IPN-123" }).eq("id", subId).select();
  check("adds the transfer reference", !r.error && r.data.length === 1, r.error?.message);
  r = await a.client.from("seller_submissions").update({ fee_status: "paid" }).eq("id", subId).select();
  check("can't mark own fee paid", Boolean(r.error));
  r = await a.client.from("seller_submissions").update({ status: "accepted" }).eq("id", subId).select();
  check("can't accept own submission", Boolean(r.error));
  r = await a.client.from("seller_submissions").insert({ ...subRow, seller_id: b.id }).select();
  check("can't submit as someone else", Boolean(r.error));
  r = await a.client.from("submission_media").insert({ submission_id: subId, kind: "photo", r2_key: "submissions/x/1.webp" }).select();
  check("adds media to own submission", !r.error, r.error?.message);

  r = await a.client.from("device_requests")
    .insert({ user_id: a.id, device_type: "apex", budget_min: 1000, budget_max: 5000, status: "notified" })
    .select().single();
  check("submits a request; status forced to new", !r.error && r.data.status === "new" && r.data.public_code.startsWith("R-"), r.error?.message);
  const reqId = r.data?.id;
  r = await a.client.from("device_requests").update({ notes: "أي ماركة" }).eq("id", reqId).select();
  check("edits own request", !r.error && r.data.length === 1, r.error?.message);
  r = await a.client.from("device_requests").update({ status: "closed" }).eq("id", reqId).select();
  check("can't change own request status", Boolean(r.error));

  r = await a.client.from("favorites").insert({ user_id: a.id, device_id: pub });
  check("saves a favorite", !r.error, r.error?.message);
  r = await a.client.from("favorites").insert({ user_id: b.id, device_id: pub });
  check("can't save a favorite for someone else", Boolean(r.error));

  console.log("\nuser B (another user)");
  r = await b.client.from("profiles").select("id").eq("id", a.id);
  check("can't read A's profile", denied(r));
  r = await b.client.from("seller_submissions").select("id").eq("id", subId);
  check("can't read A's submission", denied(r));
  r = await b.client.from("submission_media").select("id").eq("submission_id", subId);
  check("can't read A's submission media", denied(r));
  r = await b.client.from("submission_media").insert({ submission_id: subId, kind: "photo", r2_key: "x" });
  check("can't add media to A's submission", Boolean(r.error));
  r = await b.client.from("device_requests").select("id").eq("id", reqId);
  check("can't read A's request", denied(r));
  r = await b.client.from("device_requests").delete().eq("id", reqId).select();
  check("can't delete A's request", denied(r));
  r = await b.client.from("favorites").select("*").eq("user_id", a.id);
  check("can't read A's favorites", denied(r));

  // ── admin ────────────────────────────────────────────────────────────────
  console.log("\nadmin");
  r = await admin.client.from("profiles").select("id, role").in("id", [a.id, b.id, admin.id]);
  check("reads all profiles", !r.error && r.data.length === 3, r.error?.message);
  r = await admin.client.from("devices").select("id").in("id", [pub, draft]);
  check("sees drafts", !r.error && r.data.length === 2);
  r = await admin.client.from("device_private").select("sale_reason").eq("device_id", pub);
  check("reads device_private", !r.error && r.data[0]?.sale_reason === "secret", r.error?.message);
  r = await admin.client.from("inspections").select("id").eq("device_id", pub);
  check("reads inspections", !r.error && r.data.length === 1, r.error?.message);
  r = await admin.client.from("audit_log").select("id").eq("entity_id", pub);
  check("reads audit_log", !r.error && r.data.length === 1, r.error?.message);
  r = await admin.client.from("seller_submissions").select("id").eq("id", subId);
  check("reads every submission", !r.error && r.data.length === 1);
  r = await admin.client.from("seller_submissions").update({ fee_status: "paid" }).eq("id", subId).select();
  check("marks a fee paid", !r.error && r.data[0]?.fee_status === "paid", r.error?.message);
  r = await admin.client.from("device_requests").update({ status: "notified", notified_at: new Date().toISOString() }).eq("id", reqId).select();
  check("marks a request notified", !r.error && r.data.length === 1, r.error?.message);
  r = await admin.client.from("favorites").select("*").eq("user_id", a.id);
  check("reads all favorites", !r.error && r.data.length === 1);
  r = await admin.client.from("devices").update({ featured: true }).eq("id", draft).select();
  check("edits devices", !r.error && r.data.length === 1, r.error?.message);
  r = await admin.client.from("audit_log").insert({ actor_id: admin.id, entity: "device", entity_id: draft, action: "feature" });
  check("writes audit_log", !r.error, r.error?.message);
}

async function cleanup() {
  if (created.devices.length) await service.from("devices").delete().in("id", created.devices);
  if (created.devices.length) await service.from("audit_log").delete().in("entity_id", created.devices);
  for (const id of created.users) await service.auth.admin.deleteUser(id);
}

try {
  await main();
} catch (e) {
  console.error("Test run crashed:", e);
  failed++;
} finally {
  await cleanup();
}
console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll RLS checks passed");
process.exit(failed ? 1 : 0);
