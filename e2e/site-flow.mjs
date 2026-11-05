// E2E (launch check, brief §10 step 8):
//   anonymous browse → /sell sends you to /login with the draft kept → Google
//   button starts the Google sign-in → sign in (code page) → onboarding → back
//   on /sell with draft + prefill → submit with photos → «اطلب جهاز» →
//   /account → non-admin blocked from /admin → ADMIN: sees the seller's
//   photos, accepts → listing gets the photos → publishes → the public sees
//   it with its photo → sign out.
//
//   npm run e2e -- http://localhost:3000 /tmp/shots 390   (width: 390 phone, 1280 desktop)
//
// Needs SUPABASE_PROJECT_REF + SUPABASE_SERVICE_ROLE_KEY and a server on
// localhost (`npm run build && npm start`, or `npm run dev` — open it as
// localhost, not 127.0.0.1). It runs against the real database: no emails are
// sent (the sign-in code comes from the admin API, Google is never opened), and
// the test users, rows and photo files it created are deleted at the end.
// Test photos (2 PNGs) in E2E_MEDIA, e.g. made with ffmpeg:
//   ffmpeg -f lavfi -i testsrc=size=640x480 -frames:v 1 p1.png   (and p2.png)
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");

const [base = "http://127.0.0.1:3000", out = "/tmp/e2e", W = "390"] = process.argv.slice(2);
const width = Number(W);
fs.mkdirSync(out, { recursive: true });
const MEDIA = process.env.E2E_MEDIA ?? "/tmp/e2e-media";

const url = `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co`;
const service = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const email = `e2e-${Date.now()}-${width}@example.com`;
let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  [${width}] ${name}${ok ? "" : `  ${extra}`}`);
  if (!ok) failed++;
};

const browser = await chromium.launch(
  process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: "127.0.0.1,localhost" } } : {},
);
const ctx = await browser.newContext({
  viewport: { width, height: width < 768 ? 800 : 900 },
  isMobile: width < 768,
  hasTouch: width < 768,
  ignoreHTTPSErrors: Boolean(process.env.HTTPS_PROXY), // a TLS-inspecting proxy (Claude sandbox)
  locale: "ar-EG",
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
// Never really go to Google: catch the redirect to Supabase's authorize URL.
let googleCalls = 0;
await page.route("**/auth/v1/authorize*", (r) => {
  if (r.request().url().includes("provider=google")) googleCalls++;
  return r.fulfill({ status: 200, contentType: "text/html", body: "<p>google (stub)</p>" });
});
const signInCode = async (p, mail) => {
  const link = await service.auth.admin.generateLink({ type: "magiclink", email: mail });
  if (link.error) throw link.error;
  await p.locator("#au-code").fill(link.data.properties.email_otp);
};
const created2 = { users: [], devices: [], files: [] };

const layout = async (label) => {
  const m = await page.evaluate(() => ({
    iw: window.innerWidth,
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  check(`${label}: innerWidth = viewport (${m.iw})`, m.iw === width, JSON.stringify(m));
  check(`${label}: no horizontal scroll`, m.sw <= m.cw, JSON.stringify(m));
  await page.screenshot({ path: `${out}/${label.replace(/[^a-z0-9]+/gi, "_")}@${width}.png`, fullPage: true });
};

try {
  // 0. Anonymous browse.
  await page.goto(`${base}/`);
  await page.locator(".mn-card").first().waitFor({ timeout: 20000 }).catch(() => {});
  check("home: has listings", (await page.locator(".mn-card").count()) > 0);
  await layout("home");
  await page.goto(`${base}/devices`);
  const cards = page.locator(".br-card");
  await cards.first().waitFor({ timeout: 20000 });
  const nAll = await cards.count();
  check(`browse: ${nAll} published listings`, nAll > 0);
  await layout("browse");
  await page.goto(`${base}/devices?st=done`);
  await page.waitForTimeout(1200);
  const nDone = await page.locator(".br-card").count();
  check("browse: «تم الفحص» filter from the URL narrows the list", nDone <= nAll, `${nDone}/${nAll}`);
  const first = await page.locator(".br-card").first().getAttribute("href").catch(() => null);
  if (first) {
    await page.goto(`${base}${first}`);
    await page.getByRole("button", { name: /اطلب الجهاز|اطلبه/ }).first().waitFor({ timeout: 20000 }).catch(() => {});
    check("device page opens with an order button", (await page.getByText(/اطلب الجهاز/).count()) > 0);
    await layout("device");
  }

  // 1. A half-filled sell form from before (draft) + the home quick-form prefill.
  await page.goto(`${base}/`);
  await page.evaluate(() => localStorage.setItem("istimal-tabib-sell-draft", JSON.stringify({ brand: "W&H", accessories: "شاحن" })));
  await page.goto(`${base}/sell?type=endo&details=${encodeURIComponent("إندو موتور تجربة")}`);
  await page.waitForURL(/\/login\?next=/);
  check("anon /sell → /login?next=…", decodeURIComponent(page.url()).includes("next=/sell?type=endo"));
  await page.getByText("ادخل حسابك الأول علشان تعرض جهازك").waitFor();
  await layout("login");

  // Header (signed out): «دخول» visible (row ≥ 600px, inside the menu below).
  if (width >= 600) check("header shows «دخول»", await page.locator(".site-actions >> text=دخول").isVisible());
  else {
    await page.locator(".site-menu-btn").click();
    check("menu shows «دخول»", await page.locator(".acc-panel >> text=دخول").isVisible());
    await page.locator(".site-menu-btn").click();
  }

  // Google button → starts Google sign-in, keeping where to come back to.
  await page.getByRole("button", { name: "كمّل بحساب جوجل" }).click();
  await page.waitForURL(/auth\/v1\/authorize/, { timeout: 15000 });
  check("Google button starts the Google sign-in", googleCalls === 1);
  check("…and comes back to /sell after", decodeURIComponent(decodeURIComponent(page.url())).includes("next=/sell?type=endo"), page.url());

  // 2. Sign in (the code page stands in for Google here).
  const { data: created, error: cErr } = await service.auth.admin.createUser({ email, email_confirm: true });
  if (cErr) throw cErr;
  await page.goto(`${base}/login/verify?email=${encodeURIComponent(email)}&next=${encodeURIComponent("/sell?type=endo&details=" + encodeURIComponent("إندو موتور تجربة"))}`);
  await page.locator("#au-code").fill("000000");
  await page.getByText("الكود غلط أو خلص وقته").waitFor({ timeout: 15000 });
  check("wrong code rejected", true);
  await signInCode(page, email);
  await page.waitForURL(/\/onboarding/, { timeout: 20000 });
  check("new user → /onboarding with next kept", decodeURIComponent(page.url()).includes("next=/sell?type=endo"));
  await layout("onboarding");

  // 3. Onboarding validation, then save.
  await page.getByRole("button", { name: "احفظ وكمّل" }).click();
  check("onboarding requires fields", await page.getByText("اكتب اسمك بالكامل").isVisible());
  await page.locator("#pf-full_name").fill("د. تجربة آلية");
  await page.locator("#pf-phone").fill("٠١٠٠١٢٣٤٥٦٧");
  await page.locator("#pf-governorate").selectOption("الجيزة");
  await page.locator("#pf-address").fill("الدقي");
  await page.getByRole("radio", { name: "عيادة أو مركز" }).click();
  await page.getByRole("button", { name: "احفظ وكمّل" }).click();
  await page.waitForURL(/\/sell\?type=endo/, { timeout: 20000 });
  check("back on /sell after onboarding", true);

  // 4. Draft + prefill restored.
  await page.locator("#sl-f-brand").waitFor();
  await page.waitForTimeout(800);
  check("draft restored (brand)", (await page.locator("#sl-f-brand").inputValue()) === "W&H");
  check("draft restored (accessories)", (await page.locator("#sl-f-accessories").inputValue()) === "شاحن");
  check("URL prefill (type)", (await page.locator("#sl-f-deviceType").inputValue()) === "endo");
  check("URL prefill (details)", (await page.locator("#sl-f-details").inputValue()) === "إندو موتور تجربة");
  check("profile prefill (name)", (await page.locator("#sl-f-fullName").inputValue()) === "د. تجربة آلية");
  check("profile prefill (phone)", (await page.locator("#sl-f-phone").inputValue()) === "01001234567");
  check("draft banner shown", await page.getByText("رجّعنالك البيانات اللي كنت كتبتها").isVisible());
  await layout("sell-signed-in");

  // Header (signed in): avatar.
  if (width >= 600) {
    await page.locator(".acc-btn").click();
    const items = await page.locator(".acc-menu [role=menuitem]").allInnerTexts();
    check("avatar menu: حسابي/أجهزتي/تسجيل الخروج, no لوحة التحكم", items.join("|") === "حسابي|أجهزتي|تسجيل الخروج", items.join("|"));
    await layout("avatar-menu-open");
    await page.keyboard.press("Escape");
  } else {
    check("menu button has avatar badge", await page.locator(".site-menu-btn .acc-badge").isVisible());
    await page.locator(".site-menu-btn").click();
    const items = await page.locator(".acc-panel-links > *").allInnerTexts();
    check("menu panel: حسابي/أجهزتي + اخرج", items.join("|") === "حسابي|أجهزتي" && (await page.getByRole("button", { name: "تسجيل الخروج" }).isVisible()), items.join("|"));
    await layout("phone-menu-open");
    await page.locator(".site-menu-btn").click();
  }

  // 5. Submit the sell form.
  await page.locator("#sl-f-pickupAddress").fill("الدقي، شارع التحرير");
  await page.locator("#sl-f-saleReason").fill("تجربة آلية — احذفوه");
  await page.locator("input[name=condition]").first().check();
  await page.locator("input[name=warranty]").nth(1).check();
  await page.locator("input[name=box]").first().check();
  await page.locator("input[name=repaired]").nth(1).check();
  await page.locator("#sl-f-defects").fill("لا يوجد");
  const keep = page.locator("input[name=keep]");
  if (await keep.count()) await keep.nth(1).check();
  const pics = page.locator("input[type=file][accept=\"image/*\"]");
  await pics.first().setInputFiles([`${MEDIA}/p1.png`, `${MEDIA}/p2.png`]);
  if ((await pics.count()) > 1) await pics.nth(1).setInputFiles([`${MEDIA}/p2.png`]); // accessories
  await page.locator("#sl-f-sale").fill("12000");
  for (const cb of await page.locator("aside input[type=checkbox], #sl-f-acks").all()) if (!(await cb.isChecked())) await cb.check();
  const acks = page.locator("input[type=checkbox]");
  for (let i = 0; i < (await acks.count()); i++) {
    const cb = acks.nth(i);
    const label = await cb.evaluate((el) => el.closest("label")?.textContent ?? "");
    if (/أقر|موافق/.test(label) && !(await cb.isChecked())) await cb.check();
  }
  await page.getByRole("button", { name: "ابعت الطلب" }).click();
  await page.locator("[data-testid=sell-id]").waitFor({ timeout: 60000 });
  const code = await page.locator("[data-testid=sell-id]").innerText();
  check(`sell saved with a database code (${code})`, /^#\d{4,}$/.test(code));
  const { data: subRow } = await service.from("seller_submissions").select("id, fee_status, status, seller_id, brand, condition").eq("public_code", code).single();
  check("row in seller_submissions, owned by the user, pending/new", subRow?.seller_id === created.user.id && subRow.fee_status === "pending" && subRow.status === "new" && subRow.brand === "W&H");
  const { data: media } = await service.from("submission_media").select("kind, r2_key, mime").eq("submission_id", subRow.id);
  created2.files.push(...(media ?? []).map((m) => ["submission-photos", m.r2_key]));
  check("photos uploaded: 2 + 1 accessory, shrunk to WebP", media?.length === 3 && media.every((m) => m.mime === "image/webp"), JSON.stringify(media));
  check("draft cleared after submit", (await page.evaluate(() => localStorage.getItem("istimal-tabib-sell-draft-v2") ?? localStorage.getItem("istimal-tabib-sell-draft"))) === null);
  // (The seriousness fee is asked for on WhatsApp after the request is accepted — nothing to pay here.)

  // 6. Request form.
  await page.goto(`${base}/request?type=loupe`);
  await page.locator("#rq-f-min").fill("٥٠٠٠");
  await page.locator("#rq-f-max").fill("9000");
  const pre = await page.waitForFunction(() => document.querySelector("#rq-f-fullName")?.value === "د. تجربة آلية", null, { timeout: 8000 }).then(() => true, () => false);
  check("request: profile prefill (name)", pre);
  await page.getByRole("button", { name: "ابعت الطلب" }).click();
  await page.getByText(/R-\d+/).first().waitFor({ timeout: 20000 });
  const { data: reqRows } = await service.from("device_requests").select("public_code, budget_min, budget_max, device_type").eq("user_id", created.user.id);
  check("row in device_requests", reqRows?.length === 1 && reqRows[0].budget_min === 5000 && reqRows[0].device_type === "loupe", JSON.stringify(reqRows));

  // 7. /account tabs.
  await page.goto(`${base}/account`);
  await page.getByRole("tab", { name: /أجهزتي المعروضة/ }).waitFor();
  check("account: submission listed", await page.getByText(code).isVisible());
  check("account: «we review within 24 h», no fee asked yet", (await page.getByText("بنراجع طلبك (خلال 24 ساعة)").count()) > 0 && !(await page.getByText("رسوم الجدية لسه ما اتدفعتش").count()));
  await layout("account-devices");
  await page.locator("#tab-requests").click();
  check("account: request listed", await page.getByText(reqRows[0].public_code).isVisible());
  check("account: URL has ?tab=requests", page.url().includes("tab=requests"));
  await page.getByRole("tab", { name: "المحفوظات" }).click();
  check("account: saved empty state", await page.getByText("لسه ما حفظتش أجهزة").isVisible());
  await page.locator("#tab-orders").click();
  check("account: طلباتي قريباً", await page.getByText("هنا هتتابع طلبات الشراء").isVisible());
  await page.getByRole("tab", { name: "بياناتي" }).click();
  await page.locator("#pf-address").fill("الدقي، الجيزة");
  await page.getByRole("button", { name: "احفظ التعديلات" }).click();
  await page.getByText("اتحفظت بياناتك").waitFor();
  check("account: profile edit saved", true);
  await layout("account-profile");

  // 8. Non-admin blocked from /admin.
  const res = await page.goto(`${base}/admin/devices`);
  check("non-admin /admin → 403 page", res.status() === 403 && (await page.getByText("الصفحة دي للفريق بس").isVisible()), String(res.status()));
  await layout("forbidden");

  // 9. /login while signed in → next.
  await page.goto(`${base}/login?next=/account`);
  check("signed-in /login → /account", new URL(page.url()).pathname === "/account");

  // 9b. Admin: the seller's photos → accept → publish → public sees it.
  const adminEmail = `e2e-admin-${Date.now()}-${width}@example.com`;
  const { data: ad } = await service.auth.admin.createUser({ email: adminEmail, email_confirm: true });
  created2.users.push(ad.user.id);
  await service.from("profiles").update({ role: "admin", full_name: "مدير تجربة", phone: "01000000000", governorate: "القاهرة", account_type: "clinic", onboarded_at: new Date().toISOString() }).eq("id", ad.user.id);
  const actx = await browser.newContext({ viewport: { width: 1280, height: 900 }, ignoreHTTPSErrors: Boolean(process.env.HTTPS_PROXY), locale: "ar-EG" });
  const a = await actx.newPage();
  a.on("pageerror", (e) => errors.push(`admin: ${e.message}`));
  await a.goto(`${base}/login/verify?email=${encodeURIComponent(adminEmail)}&next=${encodeURIComponent(`/admin/submissions?open=${encodeURIComponent(code)}`)}`);
  await signInCode(a, adminEmail);
  await a.waitForURL(/\/admin\/submissions/, { timeout: 30000 });
  await a.locator(".sb-photos img").first().waitFor({ timeout: 30000 });
  check("admin: sees the seller's 3 photos", (await a.locator(".sb-photos img").count()) === 3);
  await a.getByRole("button", { name: /قبول وتحويل لإعلان/ }).click();
  await a.getByRole("button", { name: /أكّد القبول/ }).click();
  await a.getByRole("link", { name: "كمّل الإعلان" }).first().waitFor({ timeout: 20000 });
  let devId, dm = [];
  for (let i = 0; i < 40 && dm.length < 3; i++) {
    await a.waitForTimeout(500);
    const { data: sr } = await service.from("seller_submissions").select("device_id, status").eq("id", subRow.id).single();
    devId = sr?.device_id;
    if (devId) dm = (await service.from("device_media").select("r2_key").eq("device_id", devId)).data ?? [];
  }
  if (devId) created2.devices.push(devId);
  created2.files.push(...dm.map((m) => ["device-photos", m.r2_key]));
  check("admin: accept → draft listing with the 3 photos", dm.length === 3, `${devId} ${JSON.stringify(dm)}`);
  await a.getByRole("link", { name: "كمّل الإعلان" }).first().click();
  await a.waitForURL(/\/edit/, { timeout: 20000 });
  await a.locator("section[aria-labelledby=ad-s4] img").first().waitFor({ timeout: 30000 });
  const pubBtn = a.getByRole("button", { name: "انشر الجهاز" });
  check("admin: listing ready to publish (title, price, photos)", await pubBtn.isEnabled());
  await pubBtn.click();
  let st;
  for (let i = 0; i < 30 && st !== "published"; i++) { await a.waitForTimeout(500); st = (await service.from("devices").select("status").eq("id", devId).single()).data?.status; }
  check("admin: published", st === "published", st);
  await actx.close();
  const { data: dv } = await service.from("devices").select("public_code").eq("id", devId).single();
  const anonCtx = await browser.newContext({ viewport: { width, height: 800 }, isMobile: width < 768, ignoreHTTPSErrors: Boolean(process.env.HTTPS_PROXY), locale: "ar-EG" });
  const pub = await anonCtx.newPage();
  await pub.goto(`${base}/devices`);
  const card = pub.locator(`a[href="/devices/${encodeURIComponent(dv.public_code)}"] img`).first();
  await card.waitFor({ timeout: 30000 }).catch(() => {});
  check("public: new listing on «كل الأجهزة» with its photo", (await card.count()) === 1);
  await pub.goto(`${base}/devices/${encodeURIComponent(dv.public_code)}`);
  await pub.locator(".li-thumb img").first().waitFor({ timeout: 30000 }).catch(() => {});
  check("public: device page shows the 3 photos", (await pub.locator(".li-thumb img").count()) === 3);
  await anonCtx.close();

  // 10. Sign out.
  if (width >= 600) {
    await page.locator(".acc-btn").click();
    await page.getByRole("menuitem", { name: "تسجيل الخروج" }).click();
  } else {
    await page.locator(".site-menu-btn").click();
    await page.getByRole("button", { name: "تسجيل الخروج" }).click();
  }
  await page.waitForURL(`${base}/`);
  await page.waitForTimeout(800);
  const after = await page.goto(`${base}/account`);
  check("after sign-out /account → /login", new URL(page.url()).pathname === "/login", `${after.status()} ${page.url()}`);

  // 11. Signed out /admin → login.
  await page.goto(`${base}/admin`);
  check("signed-out /admin → /login?next=/admin", page.url().includes("/login?next=%2Fadmin"));

  check("no page errors", errors.length === 0, errors.join(" | "));
} catch (e) {
  console.error("CRASH", e);
  console.error("on screen:", (await page.locator("[role=alert], .sl-err").allInnerTexts().catch(() => [])).join(" | "));
  await page.screenshot({ path: `${out}/crash@${width}.png`, fullPage: true }).catch(() => {});
  failed++;
} finally {
  // Clean up: the user's rows cascade with the account.
  for (const bucket of ["submission-photos", "device-photos"]) {
    const paths = created2.files.filter(([b]) => b === bucket).map(([, p]) => p);
    if (paths.length) await service.storage.from(bucket).remove(paths);
  }
  for (const id of created2.devices) {
    await service.from("seller_submissions").update({ device_id: null }).eq("device_id", id);
    await service.from("inspections").delete().eq("device_id", id);
    await service.from("devices").delete().eq("id", id);
    await service.from("audit_log").delete().eq("entity_id", id);
  }
  const { data: list } = await service.auth.admin.listUsers({ perPage: 1000 });
  for (const u of list?.users ?? []) if (u.email === email) await service.auth.admin.deleteUser(u.id);
  for (const id of created2.users) await service.auth.admin.deleteUser(id);
  await browser.close();
}
console.log(failed ? `${failed} FAILED` : "ALL PASSED");
process.exit(failed ? 1 : 0);
