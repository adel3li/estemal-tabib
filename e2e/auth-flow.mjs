// E2E: email-code login → onboarding → back to /sell with draft + prefill →
// submit sell + request → /account → sign out → non-admin blocked from /admin.
//
//   node e2e/auth-flow.mjs http://localhost:3000 /tmp/shots 390
//
// Needs SUPABASE_PROJECT_REF + SUPABASE_SERVICE_ROLE_KEY and a dev server on
// localhost (not 127.0.0.1 — Next blocks dev assets there). No emails are sent:
// the "send code" call is intercepted and the code comes from the admin API.
// Test media (2 PNGs + a 16 s clip.webm) in E2E_MEDIA, e.g. made with ffmpeg:
//   ffmpeg -f lavfi -i testsrc=duration=16:size=320x240:rate=10 -c:v libvpx clip.webm
//   ffmpeg -f lavfi -i testsrc=size=640x480 -frames:v 1 p1.png   (and p2.png)
// The test user and everything it created are deleted at the end.
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
// Never send real emails: answer the "send code" call ourselves.
let otpCalls = 0;
await page.route("**/auth/v1/otp*", (r) => {
  otpCalls++;
  return r.fulfill({ status: 200, contentType: "application/json", body: "{}" });
});

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

  // Google not configured yet → friendly message, no redirect.
  await page.getByRole("button", { name: "كمّل بحساب جوجل" }).click();
  check("Google button explains it's not ready", await page.getByText("الدخول بجوجل لسه بيتجهز").isVisible());

  // 2. Email → code.
  await page.locator("#au-email").fill("not-an-email");
  await page.getByRole("button", { name: "ابعتلي الكود" }).click();
  check("invalid email message", await page.getByText("اكتب إيميل صحيح").isVisible());
  await page.locator("#au-email").fill(email);
  await page.getByRole("button", { name: "ابعتلي الكود" }).click();
  await page.waitForURL(/\/login\/verify/);
  check("send-code request made (intercepted, no email)", otpCalls === 1);
  check("resend locked for 60s", await page.getByRole("button", { name: /ابعت كود جديد بعد/ }).isDisabled());
  await layout("verify");

  // Wrong code first.
  const { data: created, error: cErr } = await service.auth.admin.createUser({ email, email_confirm: true });
  if (cErr) throw cErr;
  await page.locator("#au-code").fill("000000");
  await page.getByText("الكود غلط أو خلص وقته").waitFor({ timeout: 15000 });
  check("wrong code rejected", true);

  const link = await service.auth.admin.generateLink({ type: "magiclink", email });
  if (link.error) throw link.error;
  await page.locator("#au-code").fill(link.data.properties.email_otp);
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
    check("avatar menu: حسابي/أجهزتي/اخرج, no لوحة التحكم", items.join("|") === "حسابي|أجهزتي|اخرج", items.join("|"));
    await layout("avatar-menu-open");
    await page.keyboard.press("Escape");
  } else {
    check("menu button has avatar badge", await page.locator(".site-menu-btn .acc-badge").isVisible());
    await page.locator(".site-menu-btn").click();
    const items = await page.locator(".acc-panel-links > *").allInnerTexts();
    check("menu panel: حسابي/أجهزتي/اخرج", items.join("|") === "حسابي|أجهزتي|اخرج", items.join("|"));
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
  await page.locator("input[type=file][accept=\"image/*\"]").first().setInputFiles([`${MEDIA}/p1.png`, `${MEDIA}/p2.png`]);
  await page.locator("input[type=file][accept=\"video/*\"]").setInputFiles(`${MEDIA}/clip.webm`);
  await page.locator("#sl-f-sale").fill("12000");
  for (const cb of await page.locator("aside input[type=checkbox], #sl-f-acks").all()) if (!(await cb.isChecked())) await cb.check();
  const acks = page.locator("input[type=checkbox]");
  for (let i = 0; i < (await acks.count()); i++) {
    const cb = acks.nth(i);
    const label = await cb.evaluate((el) => el.closest("label")?.textContent ?? "");
    if (/أقر|موافق/.test(label) && !(await cb.isChecked())) await cb.check();
  }
  await page.waitForTimeout(1500); // video duration read
  await page.getByRole("button", { name: "ابعت الطلب" }).click();
  await page.locator("[data-testid=sell-id]").waitFor({ timeout: 20000 });
  const code = await page.locator("[data-testid=sell-id]").innerText();
  check(`sell saved with a database code (${code})`, /^#\d{4,}$/.test(code));
  const { data: subRow } = await service.from("seller_submissions").select("id, fee_status, status, seller_id, brand, condition").eq("public_code", code).single();
  check("row in seller_submissions, owned by the user, pending/new", subRow?.seller_id === created.user.id && subRow.fee_status === "pending" && subRow.status === "new" && subRow.brand === "W&H");
  check("draft cleared after submit", (await page.evaluate(() => localStorage.getItem("istimal-tabib-sell-draft"))) === null);
  await page.locator(".sl-done input").fill("IPN-778899");
  await page.getByRole("button", { name: "سجّل رقم التحويل" }).click();
  await page.waitForTimeout(1500);
  const { data: refRow } = await service.from("seller_submissions").select("fee_reference").eq("public_code", code).single();
  check("transfer reference saved", refRow?.fee_reference === "IPN-778899");

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
  check("account: fee pill", await page.getByText("رسوم الجدية لسه ما اتدفعتش").isVisible());
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

  // 10. Sign out.
  if (width >= 600) {
    await page.locator(".acc-btn").click();
    await page.getByRole("menuitem", { name: "اخرج" }).click();
  } else {
    await page.locator(".site-menu-btn").click();
    await page.locator(".acc-panel").getByRole("button", { name: "اخرج" }).click();
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
  await page.screenshot({ path: `${out}/crash@${width}.png`, fullPage: true }).catch(() => {});
  failed++;
} finally {
  // Clean up: the user's rows cascade with the account.
  const { data: list } = await service.auth.admin.listUsers({ perPage: 1000 });
  for (const u of list?.users ?? []) if (u.email === email) await service.auth.admin.deleteUser(u.id);
  await browser.close();
}
console.log(failed ? `${failed} FAILED` : "ALL PASSED");
process.exit(failed ? 1 : 0);
