import { typeLabel } from "@/lib/demo/labels";
import type { CheckKey, Condition, Inspection } from "@/lib/demo/types";
import { InSymbol, symFor } from "./art";
import { CHECKS, DAYS, ST, condLabel, isBuyer, statusOf, typePill, type Form } from "./model";

type Props = {
  it: Inspection;
  form: Form;
  err: string;
  onForm: (fn: (f: Form) => Form) => void;
  onPhotos: (files: File[]) => void;
  onClose: () => void;
  onSave: () => void;
  onApprove: () => void;
  onReopen: () => void;
};

const setCheck = (f: Form, key: CheckKey, patch: Partial<Form["checks"][CheckKey]>): Form => ({
  ...f,
  checks: { ...f.checks, [key]: { ...f.checks[key], ...patch } },
});

const CONDS: Condition[] = ["a", "b", "c"];

export function ReportPanel({ it, form: f, err, onForm, onPhotos, onClose, onSave, onApprove, onReopen }: Props) {
  const [sTxt, sBg, sFg] = ST[statusOf(it)];
  const [tTxt, tBg, tFg] = typePill(it);
  const buyer = isBuyer(it);
  const isPub = it.status === "done";
  return (
    <section className="ad-card" aria-labelledby="in-rep-h" style={{ gap: 18 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <InSymbol sym={symFor(it.deviceType)} size={56} />
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.5 }}>
          <div style={{ fontSize: 13, color: "#4A5A56" }}>تقرير الفحص · #{it.id}</div>
          <h2 id="in-rep-h" style={{ margin: 0, fontSize: 19, fontWeight: 700 }}>{it.title}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            <span className="in-pill" style={{ background: sBg, color: sFg }}>{sTxt}</span>
            <span className="in-pill" style={{ background: tBg, color: tFg }}>{tTxt}</span>
          </div>
        </div>
        <button type="button" className="in-x" onClick={onClose} aria-label="اقفل التقرير">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px", padding: "12px 14px", borderRadius: 14, background: "#F5F7F4", fontSize: 14 }}>
        <span style={{ color: "#4A5A56" }}>النوع</span><span style={{ fontWeight: 600 }}>{typeLabel(it.deviceType)}</span>
        <span style={{ color: "#4A5A56" }}>الميعاد</span><span style={{ fontWeight: 600 }}>{DAYS[it.day][0]} {DAYS[it.day][1]} أكتوبر · {it.time}</span>
        <span style={{ color: "#4A5A56" }}>المكان</span><span style={{ fontWeight: 600 }}>{it.governorate} — {it.location}</span>
        <span style={{ color: "#4A5A56" }}>الفني</span>
        <span style={{ fontWeight: 600, color: it.technician ? "#12221F" : "#B3261E" }}>{it.technician || "لسه محدش اتحدد"}</span>
        {buyer ? (
          <>
            <span style={{ color: "#4A5A56" }}>طلب المشتري</span><span style={{ fontWeight: 600 }}>{it.orderId}</span>
          </>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontWeight: 700 }}>بنود الفحص</div>
        {CHECKS.map((c) => {
          const r = f.checks[c.key];
          const p = r.v === "pass";
          const n = r.v === "note";
          return (
            <div
              key={c.key}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: `1px solid ${p ? "#B9DCA4" : n ? "#F0C88A" : "#DCE3DF"}`,
                background: p ? "#F6FBF1" : n ? "#FFF9F0" : "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 600 }}>{c.label}</span>
                  <span className="ad-hint" style={{ fontSize: 12 }}>{c.sub}</span>
                </span>
                <span role="group" aria-label={`نتيجة ${c.label}`} style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="in-mini"
                    disabled={isPub}
                    onClick={() => onForm((x) => setCheck(x, c.key, { v: "pass" }))}
                    aria-pressed={p}
                    style={{ border: `1px solid ${p ? "#3F7A1F" : "#C9D4CF"}`, background: p ? "#3F7A1F" : "#FFFFFF", color: p ? "#FFFFFF" : "#12221F" }}
                  >
                    ✓ سليم
                  </button>
                  <button
                    type="button"
                    className="in-mini"
                    disabled={isPub}
                    onClick={() => onForm((x) => setCheck(x, c.key, { v: "note" }))}
                    aria-pressed={n}
                    style={{ border: `1px solid ${n ? "#F2A33A" : "#C9D4CF"}`, background: n ? "#F2A33A" : "#FFFFFF", color: "#12221F" }}
                  >
                    فيه ملاحظة
                  </button>
                </span>
              </div>
              {n ? (
                <input
                  type="text"
                  className="ad-in"
                  style={{ minHeight: 40, fontSize: 14 }}
                  value={r.n}
                  readOnly={isPub}
                  onChange={(e) => onForm((x) => setCheck(x, c.key, { n: e.target.value }))}
                  aria-label={`ملاحظة على ${c.label}`}
                  placeholder={c.ph}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="ad-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
        <label className="ad-field">
          كفاءة التشغيل الإجمالية
          <select className="ad-in" value={f.efficiency} disabled={isPub} onChange={(e) => onForm((x) => ({ ...x, efficiency: e.target.value }))}>
            <option value="">اختار</option>
            <option>ممتاز</option>
            <option>جيد جداً</option>
            <option>جيد</option>
          </select>
        </label>
        <label className="ad-field">
          حالة المنتج
          <select
            className="ad-in"
            value={f.condition}
            disabled={isPub}
            onChange={(e) => onForm((x) => ({ ...x, condition: e.target.value as Condition | "" }))}
          >
            <option value="">اختار</option>
            {CONDS.map((c) => (
              <option key={c} value={c}>{condLabel(c)}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="ad-field">
        العيوب المعلنة
        <textarea
          className="ad-in"
          value={f.defects}
          readOnly={isPub}
          onChange={(e) => onForm((x) => ({ ...x, defects: e.target.value }))}
          placeholder="كل عيب بوضوح، هيظهر للمشتري في التقرير"
        />
      </label>

      <label className="ad-drop in-drop" style={{ position: "relative" }}>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          className="in-file"
          disabled={isPub}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onPhotos(files);
            e.target.value = "";
          }}
        />
        <span style={{ width: 44, height: 44, borderRadius: 12, background: "#3F7A1F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-8 8" /></svg>
        </span>
        <span style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <span style={{ fontWeight: 700 }}>صور وفيديو الفحص</span>
          <span className="ad-hint">صور كل جزء اتفحص، وأي عيب من قريب</span>
        </span>
        <span className="in-pill" style={{ background: f.photos ? "#EAF5DD" : "#FBE9E7", color: f.photos ? "#3F7A1F" : "#B3261E" }}>
          {f.photos ? `${f.photos} ملف مرفوع` : "لسه مفيش"}
        </span>
      </label>

      {err ? (
        <div role="alert" style={{ padding: "12px 14px", borderRadius: 14, background: "#FBE9E7", border: "1px solid #E8B4AE", color: "#B3261E", fontSize: 14 }}>
          <div style={{ fontWeight: 700 }}>لسه ناقص قبل الاعتماد:</div>
          <div>{err}</div>
        </div>
      ) : null}

      {!isPub ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button type="button" className="ad-btn ad-sec" style={{ flex: "1 1 140px" }} onClick={onSave}>احفظ التقرير</button>
            <button type="button" className="ad-btn ad-pri" style={{ flex: "1 1 180px" }} onClick={onApprove}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
              اعتمد ونشّر
            </button>
          </div>
          <div className="ad-hint">
            «احفظ» بيحوّله لـ «محتاج مراجعة». «اعتمد ونشّر»{" "}
            {buyer ? "بيبعت التقرير للمشتري ويحرّك طلبه لخطوة «تقرير الفحص»." : "بينشر الجهاز في «كل الأجهزة» بعلامة «تم الفحص»."}
          </div>
        </>
      ) : (
        <div style={{ padding: "12px 14px", borderRadius: 14, background: "#EAF5DD", color: "#3F7A1F", fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span>التقرير معتمد · {buyer ? `اتبعت للمشتري (${it.orderId ?? ""})` : "الجهاز منشور بعلامة «تم الفحص»"}</span>
          <button type="button" className="in-mini" onClick={onReopen} style={{ border: "1px solid #A9CF8E", background: "#FFFFFF", color: "#12221F" }}>افتح للتعديل</button>
        </div>
      )}
    </section>
  );
}
