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

export default function SettingsPage() {
  const { raw } = useSettings();
  // Remount the form once the saved values arrive.
  const key = Object.values(raw).join("|");
  return (
    <>
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الإعدادات</div>
        <h1 className="hm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>الإعدادات</h1>
        <div style={{ color: "#4A5A56" }}>رقم الواتساب وبيانات التحويل ولينكات السوشيال اللي بتظهر في الموقع. أي خانة فاضية بيظهر مكانها النص المؤقت.</div>
      </div>
      <Form key={key} initial={raw} />
    </>
  );
}
