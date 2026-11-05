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
  // admin: true → "admin", or a role name ("marketing").
  const email = `${tag}-${label}@example.com`;
  const { data, error } = await service.auth.admin.createUser({ email, email_confirm: true });
  if (error) throw error;
  if (admin) {
    const up = await service.from("profiles").update({ role: admin === true ? "admin" : admin }).eq("id", data.user.id);
    if (up.error) throw up.error;
  }
  const link = await service.auth.admin.generateLink({ type: "magiclink", email });
  if (link.error) throw link.error;
  const client = createClient(url, anonKey, opts);
  const v = await client.auth.verifyOtp({ email, token: link.data.properties.email_otp, type: "email" });
  if (v.error) throw v.error;
  return { id: data.user.id, email, client };
}

const created = { users: [], devices: [], orders: [], reviews: [], objects: { "submission-photos": [], "device-photos": [] } };

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

  // ── Orders (control panel step 3) ────────────────────────────────────────
  console.log("\norders, payments, archived «تم البيع»");
  const sold = await service
    .from("devices")
    .insert([
      { title: `${tag} sold fresh`, type: "apex", condition: "a", sale_price: 1000, status: "sold", archive_at: new Date(Date.now() + 86400e3).toISOString() },
      { title: `${tag} sold archived`, type: "apex", condition: "a", sale_price: 1000, status: "sold", archive_at: new Date(Date.now() - 1000).toISOString() },
    ])
    .select("id, title");
  if (sold.error) throw sold.error;
  const fresh = sold.data.find((d) => d.title.endsWith("fresh")).id;
  const archived = sold.data.find((d) => d.title.endsWith("archived")).id;
  created.devices.push(fresh, archived);
  r = await anon.from("devices").select("id").in("id", [fresh, archived]);
  check("anon sees a sold device during the warranty window, not after (archived)", !r.error && r.data.length === 1 && r.data[0].id === fresh, JSON.stringify(r.data));
  r = await anon.from("public_devices").select("id").in("id", [fresh, archived]);
  check("public_devices hides archived too", !r.error && r.data.length === 1);
  r = await admin.client.from("devices").select("id").in("id", [fresh, archived]);
  check("admin still sees archived devices", !r.error && r.data.length === 2);

  r = await admin.client.from("orders").insert({ device_id: pub, price: 1000, delivery_name: "x", delivery_phone: "01000000000" }).select("id").single();
  check("admin enters an order without a buyer account", !r.error, r.error?.message);
  if (r.data) created.orders.push(r.data.id);
  r = await service.from("orders").insert({ device_id: pub, buyer_id: a.id, price: 1000, status: "inspection_report" }).select("id").single();
  if (r.error) throw r.error;
  const ord = r.data.id;
  created.orders.push(ord);
  r = await a.client.from("orders").select("id").eq("id", ord);
  check("buyer reads own order", !r.error && r.data.length === 1);
  r = await b.client.from("orders").select("id").eq("id", ord);
  check("another user can't read it", denied(r));
  r = await a.client.from("orders").update({ status: "trial" }).eq("id", ord).select();
  check("buyer can't change the order", denied(r));
  r = await a.client.from("payments").insert({ order_id: ord, kind: "balance", amount: 1, status: "confirmed" });
  check("buyer can't record a payment", Boolean(r.error));
  r = await b.client.rpc("buyer_report_decision", { p_order: ord, p_accept: true });
  check("another user can't answer the report", Boolean(r.error));
  r = await a.client.rpc("buyer_report_decision", { p_order: ord, p_accept: true });
  check("buyer accepts the report → shipping", !r.error && r.data === "shipping", r.error?.message);
  r = await a.client.rpc("buyer_report_decision", { p_order: ord, p_accept: false });
  check("can't answer twice", Boolean(r.error));
  r = await anon.rpc("buyer_report_decision", { p_order: ord, p_accept: true });
  check("anon can't call buyer_report_decision", Boolean(r.error));

  // ── Marketing & follow-up team (control panel step 5) ────────────────────
  console.log("\nmarketing team");
  const mk = await makeUser("marketing", "marketing");
  created.users.push(mk.id);
  r = await mk.client.from("profiles").select("id, phone").in("id", [a.id, b.id]);
  check("reads customers' profiles (phones)", !r.error && r.data.length === 2, r.error?.message);
  r = await mk.client.from("orders").select("id").eq("id", ord);
  check("reads orders", !r.error && r.data.length === 1);
  r = await mk.client.from("device_requests").select("id").eq("id", reqId);
  check("reads «اطلب جهاز» requests", !r.error && r.data.length === 1);
  r = await mk.client.from("device_requests").update({ status: "closed" }).eq("id", reqId).select();
  check("updates a request status", !r.error && r.data.length === 1, r.error?.message);
  for (const t of ["payments", "device_private", "seller_submissions", "inspections", "audit_log"]) {
    r = await mk.client.from(t).select("*").limit(5);
    check(`can't read ${t}`, denied(r), JSON.stringify(r.data)?.slice(0, 120));
  }
  r = await mk.client.from("orders").update({ tracking_no: "TRK-1", shipping_company: "x" }).eq("id", ord).select();
  check("updates shipping data on an order", !r.error && r.data.length === 1, r.error?.message);
  r = await mk.client.from("orders").update({ status: "delivered" }).eq("id", ord).select();
  check("moves shipping → delivered", !r.error && r.data[0]?.status === "delivered", r.error?.message);
  r = await mk.client.from("orders").update({ status: "trial", delivered_at: new Date().toISOString(), trial_ends_at: new Date(Date.now() + 3 * 86400e3).toISOString() }).eq("id", ord).select();
  check("moves delivered → trial (receipt)", !r.error && r.data[0]?.status === "trial", r.error?.message);
  const dv = await service.from("devices").select("status, archive_at").eq("id", pub).single();
  check("trigger: the listing became «تم البيع» with archive date", dv.data.status === "sold" && !!dv.data.archive_at, JSON.stringify(dv.data));
  r = await mk.client.from("orders").update({ status: "released_to_seller" }).eq("id", ord).select();
  check("can't release money to the seller", Boolean(r.error));
  r = await mk.client.from("orders").update({ price: 1 }).eq("id", ord).select();
  check("can't change the price", Boolean(r.error));
  r = await mk.client.from("orders").insert({ device_id: pub, price: 1 });
  check("can't create an order", Boolean(r.error));
  r = await mk.client.from("devices").update({ featured: true }).eq("id", pub).select();
  check("can't edit a device", denied(r));
  r = await mk.client.from("profiles").update({ role: "admin" }).eq("id", mk.id);
  check("can't make self admin", Boolean(r.error));
  r = await mk.client.rpc("set_team_role", { p_email: a.email, p_role: "marketing" });
  check("can't manage the team", Boolean(r.error));
  r = await mk.client.rpc("demand_stats");
  check("reads demand stats", !r.error && Array.isArray(r.data), r.error?.message);
  r = await a.client.rpc("demand_stats");
  check("a normal user can't read demand stats", Boolean(r.error));
  r = await anon.rpc("count_device_view", { p_code: "L-does-not-exist" });
  check("anon can count a view", !r.error, r.error?.message);
  r = await admin.client.rpc("set_team_role", { p_email: b.email, p_role: "marketing" });
  check("admin adds a team member by email", !r.error, r.error?.message);
  r = await admin.client.rpc("set_team_role", { p_email: admin.email, p_role: "user" });
  check("admin can't demote self", Boolean(r.error));

  // ── Settings, customer notes, expenses (control panel step 6) ────────────
  console.log("\nsettings, customer notes, device expenses");
  r = await anon.from("site_settings").select("whatsapp").eq("id", 1);
  check("anon reads the public settings", !r.error && r.data.length === 1, r.error?.message);
  r = await a.client.from("site_settings").update({ whatsapp: "01000000000" }).eq("id", 1).select();
  check("a user can't change settings", denied(r));
  r = await mk.client.from("site_settings").update({ whatsapp: "01000000000" }).eq("id", 1).select();
  check("marketing can't change settings", denied(r));
  const before = (await service.from("site_settings").select("whatsapp").eq("id", 1).single()).data.whatsapp;
  r = await admin.client.from("site_settings").update({ whatsapp: before }).eq("id", 1).select();
  check("admin changes settings", !r.error && r.data.length === 1, r.error?.message);
  r = await mk.client.from("customer_notes").insert({ customer_id: a.id, body: "اتكلمنا على واتساب" }).select().single();
  check("marketing writes a customer note", !r.error && r.data.author_id === mk.id, r.error?.message);
  r = await mk.client.from("customer_notes").insert({ customer_id: a.id, body: "x", author_id: admin.id });
  check("can't write a note as someone else", Boolean(r.error));
  r = await a.client.from("customer_notes").select("id").eq("customer_id", a.id);
  check("the customer can't read notes about them", denied(r));
  r = await admin.client.from("customer_notes").select("id").eq("customer_id", a.id);
  check("admin reads notes", !r.error && r.data.length === 1);
  r = await admin.client.from("device_expenses").insert({ device_id: pub, kind: "shipping", amount: 150 }).select().single();
  check("admin records an expense", !r.error, r.error?.message);
  r = await mk.client.from("device_expenses").select("id").eq("device_id", pub);
  check("marketing can't read expenses", denied(r));
  r = await mk.client.from("device_expenses").insert({ device_id: pub, kind: "other", amount: 1 });
  check("marketing can't add expenses", Boolean(r.error));
  r = await anon.from("device_expenses").select("id").limit(1);
  check("anon can't read expenses", denied(r));

  // ── Reviews ──────────────────────────────────────────────────────────────
  console.log("\nreviews");
  r = await anon.from("reviews").insert({ author_name: `${tag} زائر`, role: "buyer", rating: 5, body: "تجربة ممتازة جداً" });
  check("anon sends a review", !r.error, r.error?.message);
  r = await a.client.from("reviews").insert({ author_name: `${tag} مستخدم`, role: "seller", rating: 4, body: "تجربة كويسة", status: "published", source: "team" });
  check("a user sends a review (asking to publish it is ignored)", !r.error, r.error?.message);
  r = await mk.client.from("reviews").insert({ author_name: `${tag} عميل قديم`, role: "buyer", rating: 5, body: "اتعاملت معاهم قبل كده", status: "published", source: "team" });
  check("the team adds a published review", !r.error, r.error?.message);
  const mine = await service.from("reviews").select("id, status, source, user_id").like("author_name", `${tag}%`);
  created.reviews = mine.data.map((x) => x.id);
  const sent = mine.data.filter((x) => x.source === "site");
  check("sent reviews start pending, from the site, with the sender's id", sent.length === 2 && sent.every((x) => x.status === "pending") && sent.some((x) => x.user_id === a.id));
  check("the team's review is published", mine.data.some((x) => x.source === "team" && x.status === "published"));
  r = await anon.from("reviews").select("id").like("author_name", `${tag}%`);
  check("pending reviews aren't public (only the team's published one shows)", !r.error && r.data.length === 1);
  r = await anon.from("reviews").select("user_id").limit(1);
  check("the public can't read who sent a review", Boolean(r.error));
  r = await mk.client.from("reviews").select("id").like("author_name", `${tag}%`);
  check("marketing sees pending reviews", !r.error && r.data.length === 3);
  const pend = sent[0].id;
  r = await mk.client.from("reviews").update({ status: "published" }).eq("id", pend).select("id");
  check("marketing publishes a review", !r.error && r.data.length === 1, r.error?.message);
  r = await anon.from("reviews").select("id, published_at").eq("id", pend);
  check("published review is public with a date", !r.error && r.data.length === 1 && !!r.data[0].published_at);
  r = await a.client.from("reviews").update({ body: "غيرته" }).eq("id", created.reviews[0]).select("id");
  check("a user can't edit reviews", denied(r));
  r = await a.client.from("reviews").delete().eq("id", created.reviews[0]).select("id");
  check("a user can't delete reviews", denied(r));

  // ── Device categories ────────────────────────────────────────────────────
  console.log("\ndevice categories");
  r = await anon.from("device_categories").select("id").eq("id", "unit");
  check("anon reads categories", !r.error && r.data.length === 1);
  const catId = `t_${Date.now().toString(36)}`;
  r = await a.client.from("device_categories").insert({ id: catId, label: "نوع تجربة" });
  check("a user can't add a category", Boolean(r.error));
  r = await mk.client.from("device_categories").insert({ id: catId, label: "نوع تجربة" });
  check("marketing can't add a category", Boolean(r.error));
  r = await admin.client.from("device_categories").insert({ id: catId, label: "نوع تجربة", fields: [{ key: "f1", label: "الذاكرة", kind: "select", options: ["128 GB", "256 GB"] }] }).select("id").single();
  check("admin adds a category with fields", !r.error, r.error?.message);
  r = await a.client.from("device_categories").update({ label: "x" }).eq("id", catId).select();
  check("a user can't rename a category", denied(r));
  r = await admin.client.from("devices").update({ type: "no_such_type" }).eq("id", draft).select();
  check("a device can't use an unknown category", Boolean(r.error));
  r = await admin.client.from("devices").update({ type: catId, specs: { f1: "256 GB" } }).eq("id", draft).select("type, specs").single();
  check("a device takes the new category + its details", !r.error && r.data.type === catId && r.data.specs.f1 === "256 GB", r.error?.message);
  await service.from("devices").update({ type: "apex", specs: {} }).eq("id", draft);
  await service.from("device_categories").delete().eq("id", catId);

  // ── Quantity (stock follows the orders) ──────────────────────────────────
  console.log("\nquantity");
  const q = await service.from("devices").insert({ title: `${tag} qty`, type: "cure", condition: "a", sale_price: 1000, status: "published", quantity: 3 }).select("id").single();
  created.devices.push(q.data.id);
  const stock = async () => (await service.from("devices").select("status, available, archive_at").eq("id", q.data.id).single()).data;
  let x = await stock();
  check("new listing: 3 available", x.available === 3 && x.status === "published", JSON.stringify(x));
  const o1 = await admin.client.from("orders").insert({ device_id: q.data.id, price: 2000, quantity: 2 }).select("id").single();
  created.orders.push(o1.data.id);
  x = await stock();
  check("order for 2 → 1 left, still on sale", x.available === 1 && x.status === "published", JSON.stringify(x));
  const o2 = await admin.client.from("orders").insert({ device_id: q.data.id, price: 1000, quantity: 1 }).select("id").single();
  created.orders.push(o2.data.id);
  x = await stock();
  check("last unit ordered → «محجوز», 0 left", x.available === 0 && x.status === "reserved", JSON.stringify(x));
  await admin.client.from("orders").update({ status: "trial", trial_ends_at: new Date(Date.now() + 3 * 86400e3).toISOString() }).eq("id", o1.data.id);
  x = await stock();
  check("2 of 3 received → still «محجوز»", x.status === "reserved", JSON.stringify(x));
  await admin.client.from("orders").update({ status: "cancelled_refunded" }).eq("id", o2.data.id);
  x = await stock();
  check("an order cancelled → back on sale, 1 left", x.available === 1 && x.status === "published", JSON.stringify(x));
  await admin.client.from("devices").update({ quantity: 2 }).eq("id", q.data.id);
  x = await stock();
  check("quantity lowered to 2 and both received → «تم البيع» with archive date", x.status === "sold" && x.available === 0 && !!x.archive_at, JSON.stringify(x));
  r = await anon.from("public_devices").select("quantity, available").eq("id", q.data.id);
  check("public view shows quantity / available", !r.error && r.data[0]?.quantity === 2, r.error?.message);

  // ── Photos (Supabase Storage) ────────────────────────────────────────────
  console.log("\nphotos (storage)");
  // A tiny valid PNG (1×1).
  const png = new Blob([Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="), (c) => c.charCodeAt(0))], { type: "image/png" });
  const subPath = `${a.id}/${subId}/00-test.png`;
  const SUB = "submission-photos", DEV = "device-photos";
  const up = (client, bucket, path) => client.storage.from(bucket).upload(path, png, { contentType: "image/png" });
  r = await up(a.client, SUB, subPath);
  if (!r.error) created.objects[SUB].push(subPath);
  check("seller uploads a photo to own folder", !r.error, r.error?.message);
  r = await up(a.client, SUB, `${b.id}/${subId}/00-x.png`);
  if (!r.error) created.objects[SUB].push(`${b.id}/${subId}/00-x.png`);
  check("seller can't upload into someone else's folder", Boolean(r.error));
  r = await up(anon, SUB, `${a.id}/${subId}/01-anon.png`);
  if (!r.error) created.objects[SUB].push(`${a.id}/${subId}/01-anon.png`);
  check("anon can't upload", Boolean(r.error));
  r = await a.client.storage.from(SUB).upload(`${a.id}/${subId}/03-text.txt`, new Blob(["hi"], { type: "text/plain" }), { contentType: "text/plain" });
  if (!r.error) created.objects[SUB].push(`${a.id}/${subId}/03-text.txt`);
  check("non-image files refused", Boolean(r.error));
  r = await a.client.storage.from(SUB).createSignedUrl(subPath, 60);
  check("seller opens own photo", !r.error && !!r.data?.signedUrl, r.error?.message);
  r = await b.client.storage.from(SUB).createSignedUrl(subPath, 60);
  check("another user can't open it", Boolean(r.error));
  r = await anon.storage.from(SUB).createSignedUrl(subPath, 60);
  check("anon can't open it", Boolean(r.error));
  r = await admin.client.storage.from(SUB).createSignedUrl(subPath, 60);
  check("admin opens the seller's photo", !r.error && !!r.data?.signedUrl, r.error?.message);
  r = await a.client.storage.from(SUB).remove([subPath]);
  check("seller can't delete it after sending", !r.error ? (r.data ?? []).length === 0 : true);

  const devPath = `${pub}/test-${Date.now()}.png`;
  r = await up(a.client, DEV, `${pub}/user.png`);
  if (!r.error) created.objects[DEV].push(`${pub}/user.png`);
  check("user can't add listing photos", Boolean(r.error));
  r = await admin.client.storage.from(SUB).copy(subPath, devPath, { destinationBucket: DEV });
  if (!r.error) created.objects[DEV].push(devPath);
  check("admin copies a seller photo into the listing", !r.error, r.error?.message);
  const pubUrl = anon.storage.from(DEV).getPublicUrl(devPath).data.publicUrl;
  const res = await fetch(pubUrl);
  check("anyone can view listing photos", res.ok, String(res.status));
  r = await a.client.storage.from(DEV).remove([devPath]);
  check("user can't delete listing photos", !r.error ? (r.data ?? []).length === 0 : true);
  r = await admin.client.storage.from(DEV).remove([devPath]);
  check("admin deletes a listing photo", !r.error && (r.data ?? []).length === 1, r.error?.message);
}

async function cleanup() {
  for (const [bucket, paths] of Object.entries(created.objects)) if (paths.length) await service.storage.from(bucket).remove(paths);
  if (created.reviews.length) await service.from("reviews").delete().in("id", created.reviews);
  if (created.orders.length) await service.from("payments").delete().in("order_id", created.orders);
  if (created.orders.length) await service.from("orders").delete().in("id", created.orders);
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
