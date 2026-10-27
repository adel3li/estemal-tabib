// TEMPORARY (Step 0): index of the approved design screens in /public/design.
// Replaced by the real home page in Step 4. Delete /public/design at launch.

const SCREENS = [
  { file: "Main", label: "الصفحة الرئيسية" },
  { file: "Browse", label: "كل الأجهزة" },
  { file: "Listing-Inspected", label: "صفحة جهاز — تم الفحص" },
  { file: "Listing-OnOrder", label: "صفحة جهاز — يُفحص عند الطلب" },
  { file: "Sell", label: "اعرض جهازك للبيع" },
  { file: "Request", label: "اطلب جهاز" },
  { file: "Terms", label: "شروط البيع والشراء" },
  { file: "About", label: "مين إحنا" },
  { file: "Order-Tracker", label: "متابعة الطلب", phase2: true },
  { file: "Admin", label: "لوحة التحكم — إضافة جهاز" },
  { file: "Admin-Listings", label: "لوحة التحكم — الأجهزة المعروضة" },
  { file: "Admin-Submissions", label: "لوحة التحكم — طلبات البيع الواردة" },
  { file: "Admin-Inspections", label: "لوحة التحكم — الفحوصات" },
  { file: "Admin-Requests", label: "لوحة التحكم — طلبات «اطلب جهاز»" },
  { file: "Admin-Orders", label: "لوحة التحكم — الطلبات والشحن", phase2: true },
  { file: "Admin-Payments", label: "لوحة التحكم — المدفوعات المحفوظة", phase2: true },
] as const;

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-teal">استعمال طبيب</h1>
        <p className="mt-2 text-muted">من دكتور أسنان لدكتور أسنان… بثقة</p>
        <p className="mt-6 rounded-[var(--radius-input)] bg-amber-soft p-4 text-sm text-amber-ink">
          الموقع لسه بيتبني. دي صفحات التصميم المعتمد — بتتفتح زي ما هي، والصفحات
          الحقيقية هتحل محلها خطوة بخطوة.
        </p>
      </header>

      <a
        href="/design/index.html"
        className="mb-6 flex items-center justify-between rounded-[var(--radius-card)] bg-teal p-5 font-semibold text-white shadow-card hover:bg-teal-hover"
      >
        <span>كل الشاشات في صفحة واحدة</span>
        <span aria-hidden>←</span>
      </a>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SCREENS.map((s) => (
          <li key={s.file}>
            <a
              href={`/design/${s.file}.html`}
              className="flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-input)] border border-line bg-surface px-4 py-3 hover:border-teal"
            >
              <span>{s.label}</span>
              {"phase2" in s && s.phase2 ? (
                <span className="rounded-full bg-blue-soft px-2 py-0.5 text-xs text-blue">
                  المرحلة 2
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
