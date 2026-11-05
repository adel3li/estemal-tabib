"use client";

// «الإعدادات» (docs/ADMIN_SPEC.md §8): the official WhatsApp number, transfer
// details and social links used across the site. Super Admin only. Not in the
// design files — styled like the other admin forms.
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useSettings, type SiteSettings } from "@/lib/settings";
import { supabaseBrowser } from "@/lib/supabase/client";
import "../home.css";

const FIELDS: { k: keyof SiteSettings; label: string; hint: string; ltr?: boolean; ph: string }[] = [
  { k: "whatsapp", label: "رقم الواتساب الرسمي", hint: "كل زراير «كلمنا على واتساب» واطلب الجهاز بتفتح على الرقم ده.", ltr: true, ph: "01xxxxxxxxx" },
  { k: "email", label: "البريد الإلكتروني", hint: "بيظهر في آخر الموقع.", ltr: true, ph: "info@…" },
  { k: "instapay", label: "InstaPay (العنوان أو الرقم)", hint: "بيظهر للبايع لما نطلب رسوم الجدية، وفي رسالة الواتساب.", ltr: true, ph: "name@instapay" },
  { k: "vodafone_cash", label: "رقم فودافون كاش", hint: "نفس المكان.", ltr: true, ph: "010xxxxxxxx" },
  { k: "facebook", label: "فيسبوك", hint: "لينك الصفحة.", ltr: true, ph: "facebook.com/…" },
  { k: "instagram", label: "إنستجرام", hint: "", ltr: true, ph: "instagram.com/…" },
  { k: "tiktok", label: "تيك توك", hint: "", ltr: true, ph: "tiktok.com/@…" },
];

function Form({ initial }: { initial: SiteSettings }) {
  const { reload } = useSettings();
  const { userId } = useAuth();
  const [f, setF] = useState<SiteSettings>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const digits = (v: string) => v.replace(/[^0-9]/g, "");
  const waBad = f.whatsapp.trim() !== "" && digits(f.whatsapp).length < 10;

  const save = async () => {
    if (waBad) {
      setMsg({ ok: false, txt: "رقم الواتساب ناقص — اكتبه كامل زي 01xxxxxxxxx." });
      return;
    }
    setBusy(true);
    const row = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.trim() || null]));
    const { error } = await supabaseBrowser().from("site_settings").update({ ...row, updated_by: userId }).eq("id", 1);
    setBusy(false);
    if (error) {
      setMsg({ ok: false, txt: "ما قدرناش نحفظ. جرّب تاني." });
      return;
    }
    reload();
    setMsg({ ok: true, txt: "اتحفظ — الموقع بيستخدم البيانات الجديدة دلوقتي." });
  };

  return (
    <section className="ad-card" aria-labelledby="st-h" style={{ gap: 16 }}>
      <h2 className="ad-h" id="st-h" style={{ fontWeight: 700 }}>بيانات التواصل والتحويل</h2>
      <div className="ad-grid">
        {FIELDS.map((x) => (
          <label key={x.k} className="ad-field">
            {x.label}
            <input
              type="text"
              className="ad-in"
              dir={x.ltr ? "ltr" : undefined}
              style={x.ltr ? { textAlign: "right" } : undefined}
              value={f[x.k]}
              onChange={(e) => setF((p) => ({ ...p, [x.k]: e.target.value }))}
              placeholder={x.ph}
              aria-invalid={x.k === "whatsapp" && waBad}
            />
            {x.hint ? <span className="ad-hint">{x.hint}</span> : null}
          </label>
        ))}
      </div>
      {msg ? (
        <div role="status" style={{ padding: "10px 14px", borderRadius: 12, background: msg.ok ? "#EAF5DD" : "#FBE9E7", color: msg.ok ? "#2F5E16" : "#7A1A14", fontWeight: 600 }}>{msg.txt}</div>
      ) : null}
      <div>
        <button type="button" className="ad-btn ad-pri" disabled={busy} onClick={() => void save()}>
          {busy ? "بنحفظ…" : "احفظ"}
        </button>
      </div>
    </section>
  );
}

/** «بنود الفحص الأساسية»: the default checklist every inspection starts from. */
function TemplateForm({ initial }: { initial: string[] }) {
  const { reload } = useSettings();
  const { userId } = useAuth();
  const [items, setItems] = useState<string[]>(initial);
  const [add, setAdd] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const clean = items.map((x) => x.trim()).filter(Boolean);
  const move = (i: number, d: number) => setItems((l) => { const n = [...l]; const j = i + d; if (j < 0 || j >= n.length) return l; [n[i], n[j]] = [n[j], n[i]]; return n; });
  const addItem = () => {
    const t = add.trim();
    if (!t || clean.includes(t)) return;
    setItems((l) => [...l, t]);
    setAdd("");
  };
  const save = async () => {
    if (!clean.length) {
      setMsg({ ok: false, txt: "لازم بند واحد على الأقل." });
      return;
    }
    setBusy(true);
    const { error } = await supabaseBrowser().from("site_settings").update({ inspection_template: clean, updated_by: userId }).eq("id", 1);
    setBusy(false);
    if (error) {
      setMsg({ ok: false, txt: "ما قدرناش نحفظ. جرّب تاني." });
      return;
    }
    reload();
    setMsg({ ok: true, txt: "اتحفظ — الفحوصات الجديدة هتبدأ بالبنود دي." });
  };
  return (
    <section className="ad-card" aria-labelledby="st-tpl" style={{ gap: 14 }}>
      <h2 className="ad-h" id="st-tpl" style={{ fontWeight: 700 }}>بنود الفحص الأساسية</h2>
      <div className="ad-hint">كل فحص جديد بيبدأ بالبنود دي. في صفحة الفحص تقدر تضيف أو تشيل بنود لجهاز معيّن. الفحوصات القديمة مش بتتغير.</div>
      <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((x, i) => (
          <li key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 24, textAlign: "center", color: "#4A5A56", fontWeight: 700 }}>{i + 1}</span>
            <input type="text" className="ad-in" value={x} maxLength={60} onChange={(e) => setItems((l) => l.map((y, j) => (j === i ? e.target.value : y)))} aria-label={`البند ${i + 1}`} style={{ flex: 1, minWidth: 0 }} />
            <button type="button" className="ad-btn ad-sec" style={{ minHeight: 40, padding: "0 10px" }} onClick={() => move(i, -1)} disabled={i === 0} aria-label={`طلّع البند ${i + 1} لفوق`}>↑</button>
            <button type="button" className="ad-btn ad-sec" style={{ minHeight: 40, padding: "0 10px" }} onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`نزّل البند ${i + 1} لتحت`}>↓</button>
            <button type="button" className="ad-btn ad-sec" style={{ minHeight: 40, padding: "0 10px", color: "#B3261E" }} onClick={() => setItems((l) => l.filter((_, j) => j !== i))} disabled={items.length === 1} aria-label={`امسح البند ${i + 1}`}>✕</button>
          </li>
        ))}
      </ol>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <input type="text" className="ad-in" value={add} maxLength={60} onChange={(e) => setAdd(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }} placeholder="بند جديد — مثال: الكهربا والتوصيلات" aria-label="بند فحص أساسي جديد" style={{ flex: "1 1 220px", minWidth: 0 }} />
        <button type="button" className="ad-btn ad-sec" onClick={addItem} disabled={!add.trim()}>+ ضيف بند</button>
      </div>
      {msg ? (
        <div role="status" style={{ padding: "10px 14px", borderRadius: 12, background: msg.ok ? "#EAF5DD" : "#FBE9E7", color: msg.ok ? "#2F5E16" : "#7A1A14", fontWeight: 600 }}>{msg.txt}</div>
      ) : null}
      <div>
        <button type="button" className="ad-btn ad-pri" disabled={busy} onClick={() => void save()}>
          {busy ? "بنحفظ…" : "احفظ البنود"}
        </button>
      </div>
    </section>
  );
}

export default function SettingsPage() {
  const { raw, template, loaded } = useSettings();
  // Fill the forms once the saved values arrive (not again after each save, so «اتحفظ» stays on screen).
  const key = loaded ? "loaded" : "loading";
  return (
    <>
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الإعدادات</div>
        <h1 className="hm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>الإعدادات</h1>
        <div style={{ color: "#4A5A56" }}>رقم الواتساب وبيانات التحويل ولينكات السوشيال اللي بتظهر في الموقع (أي خانة فاضية بيظهر مكانها النص المؤقت)، وبنود الفحص الأساسية.</div>
      </div>
      <Form key={key} initial={raw} />
      <TemplateForm key={key} initial={template} />
    </>
  );
}
