"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { DEVICE_TYPES, GOVERNORATES, parseNum } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import type { DeviceRequest, DeviceType } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { isEgyptMobile, normalizePhone } from "../sell/form";
import { RequestHero } from "./RequestHero";
import { RequestSuccess } from "./RequestSuccess";

type Form = {
  deviceType: DeviceType;
  brandPref: string;
  inspectionPref: DeviceRequest["inspectionPref"];
  min: string;
  max: string;
  neededBy: string;
  fullName: string;
  phone: string;
  governorate: string;
  notes: string;
};
type Key = "min" | "max" | "fullName" | "phone";
type Errors = Partial<Record<Key, string>>;
const ORDER: Key[] = ["min", "max", "fullName", "phone"];

const NEEDED = ["في أسرع وقت", "خلال شهر", "خلال 3 شهور", "مش مستعجل"];
const CHIPS: { id: Form["inspectionPref"]; label: string }[] = [
  { id: "any", label: "أي حالة" },
  { id: "inspected_only", label: "ما تم فحصه فقط" },
];
const EMPTY: Form = {
  deviceType: "unit",
  brandPref: "",
  inspectionPref: "any",
  min: "",
  max: "",
  neededBy: NEEDED[0],
  fullName: "",
  phone: "",
  governorate: GOVERNORATES[0],
  notes: "",
};

function validate(f: Form): Errors {
  const e: Errors = {};
  const hasDigits = (s: string) => /[0-9٠-٩]/.test(s);
  if (f.min.trim() && !hasDigits(f.min)) e.min = "اكتب رقم";
  if (f.max.trim() && !hasDigits(f.max)) e.max = "اكتب رقم";
  const lo = parseNum(f.min);
  const hi = parseNum(f.max);
  if (!e.max && lo && hi && lo > hi) e.max = "«لحد» لازم يكون أكبر من «من» أو زيه";
  if (!f.fullName.trim()) e.fullName = "اكتب اسمك علشان نعرف نكلمك";
  if (!f.phone.trim()) e.phone = "اكتب رقم موبايلك علشان نبلغك";
  else if (!isEgyptMobile(f.phone)) e.phone = "الرقم لازم يكون 11 رقم ويبدأ بـ 01";
  return e;
}

const fid = (k: Key) => `rq-f-${k}`;

function Field({ k, label, err, children }: { k?: Key; label: string; err: Errors; children: ReactNode }) {
  return (
    <label className="rq-field">
      {label}
      {children}
      {k && err[k] ? (
        <span id={`${fid(k)}-msg`} className="rq-msg" role="alert">
          {err[k]}
        </span>
      ) : null}
    </label>
  );
}

function bind(k: Key, err: Errors) {
  return {
    id: fid(k),
    className: err[k] ? "rq-in rq-bad" : "rq-in",
    "aria-invalid": err[k] ? true : undefined,
    "aria-describedby": err[k] ? `${fid(k)}-msg` : undefined,
  };
}

function CardHead({ n, title, step, stepFg, bg, fg, children }: { n: number; title: string; step: string; stepFg: string; bg: string; fg: string; children: ReactNode }) {
  return (
    <div className="rq-head">
      <span style={{ width: 48, height: 48, borderRadius: 15, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </svg>
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: stepFg }}>{step}</span>
        <h2 id={`rq-h${n}`} style={{ margin: 0, fontWeight: 700, fontSize: 21 }}>
          {title}
        </h2>
      </span>
    </div>
  );
}

const grid = (min: number) => ({ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))`, gap: 16 });

export function RequestForm() {
  const q = useSearchParams();
  const { addRequest } = useDemo();
  // ?type=<DeviceType id> prefill (read once, at mount).
  const [f, setF] = useState<Form>(() => {
    const t = q.get("type");
    return t && DEVICE_TYPES.some((x) => x.id === t) ? { ...EMPTY, deviceType: t as DeviceType } : EMPTY;
  });
  const [tried, setTried] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);

  const set = (patch: Partial<Form>) => setF((p) => ({ ...p, ...patch }));
  const err: Errors = tried ? validate(f) : {};

  const submit = () => {
    setTried(true);
    const e = validate(f);
    const first = ORDER.find((k) => e[k]);
    if (first) {
      const el = document.getElementById(fid(first));
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    const id = addRequest({
      fullName: f.fullName.trim(),
      phone: normalizePhone(f.phone),
      governorate: f.governorate,
      deviceType: f.deviceType,
      brandPref: f.brandPref.trim(),
      budgetMin: Math.round(parseNum(f.min)),
      budgetMax: Math.round(parseNum(f.max)),
      neededBy: f.neededBy,
      inspectionPref: f.inspectionPref,
      notes: f.notes.trim(),
    });
    setDoneId(id);
    window.scrollTo({ top: 0 });
  };

  if (doneId)
    return (
      <RequestSuccess
        id={doneId}
        onAgain={() => {
          setF(EMPTY);
          setTried(false);
          setDoneId(null);
          window.scrollTo({ top: 0 });
        }}
      />
    );

  return (
    <section style={{ maxWidth: 980, boxSizing: "content-box", margin: "0 auto", padding: "20px 20px 72px", display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ fontSize: 14, color: "#4A5A56", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <Link href={routes.home}>الرئيسية</Link>
        <span aria-hidden="true">›</span>
        <Link href={routes.devices}>كل الأجهزة</Link>
        <span aria-hidden="true">›</span>
        <span>اطلب جهاز</span>
      </div>

      <RequestHero />

      <form noValidate onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div id="rq-s1" className="rq-card" role="group" aria-labelledby="rq-h1">
          <CardHead n={1} title="الجهاز اللي محتاجه" step="الخطوة ١ من ٣" stepFg="#0D5C55" bg="#E3F0ED" fg="#0D5C55">
            <rect x="3" y="7" width="18" height="13" rx="3" />
            <path d="M8 7V5h8v2" />
            <circle cx="12" cy="13.5" r="3" />
          </CardHead>
          <div style={grid(240)}>
            <Field label="نوع الجهاز" err={err}>
              <select className="rq-in" value={f.deviceType} onChange={(e) => set({ deviceType: e.target.value as DeviceType })}>
                {DEVICE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ماركة أو موديل معيّن (اختياري)" err={err}>
              <input type="text" placeholder="مثال: أي ماركة ألماني" className="rq-in" value={f.brandPref} onChange={(e) => set({ brandPref: e.target.value })} />
            </Field>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span id="rq-insp" style={{ fontWeight: 600, fontSize: 14, color: "#24332F" }}>
              حالة الفحص
            </span>
            <div role="radiogroup" aria-labelledby="rq-insp" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CHIPS.map((c) => {
                const on = f.inspectionPref === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    className="rq-chip"
                    aria-checked={on}
                    onClick={() => set({ inspectionPref: c.id })}
                    style={{ minHeight: 46, padding: "4px 18px", borderRadius: 999, border: `1.5px solid ${on ? "#0D5C55" : "#C9D4CF"}`, background: on ? "#0D5C55" : "#FFFFFF", color: on ? "#FFFFFF" : "#12221F", font: "inherit", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
                  >
                    <svg className="rq-tick" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div id="rq-s2" className="rq-card" role="group" aria-labelledby="rq-h2">
          <CardHead n={2} title="الميزانية والتوقيت" step="الخطوة ٢ من ٣" stepFg="#8A4209" bg="#FBEEDC" fg="#C46A12">
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <path d="M3 10h18" />
            <path d="M7 15h3" />
          </CardHead>
          <div style={grid(200)}>
            <Field k="min" label="من (ج.م)" err={err}>
              <input type="text" inputMode="numeric" {...bind("min", err)} value={f.min} onChange={(e) => set({ min: e.target.value })} />
            </Field>
            <Field k="max" label="لحد (ج.م)" err={err}>
              <input type="text" inputMode="numeric" {...bind("max", err)} value={f.max} onChange={(e) => set({ max: e.target.value })} />
            </Field>
            <Field label="محتاجه إمتى؟" err={err}>
              <select className="rq-in" value={f.neededBy} onChange={(e) => set({ neededBy: e.target.value })}>
                {NEEDED.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div id="rq-s3" className="rq-card" role="group" aria-labelledby="rq-h3">
          <CardHead n={3} title="بياناتك" step="الخطوة ٣ من ٣" stepFg="#24508F" bg="#E6EDF7" fg="#24508F">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </CardHead>
          <div style={grid(240)}>
            <Field k="fullName" label="الاسم" err={err}>
              <input type="text" {...bind("fullName", err)} autoComplete="name" aria-required value={f.fullName} onChange={(e) => set({ fullName: e.target.value })} />
            </Field>
            <Field k="phone" label="رقم الموبايل (واتساب)" err={err}>
              <input type="tel" placeholder="01xxxxxxxxx" {...bind("phone", err)} dir="ltr" style={{ textAlign: "right" }} autoComplete="tel" inputMode="tel" aria-required value={f.phone} onChange={(e) => set({ phone: e.target.value })} />
            </Field>
            <Field label="المحافظة" err={err}>
              <select className="rq-in" value={f.governorate} onChange={(e) => set({ governorate: e.target.value })}>
                {GOVERNORATES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="ملاحظات (اختياري)" err={err}>
            <textarea rows={3} placeholder="أي مواصفات مهمة ليك، زي ملحقات معيّنة أو سنة صنع" className="rq-in" value={f.notes} onChange={(e) => set({ notes: e.target.value })} />
          </Field>
        </div>

        <div style={{ padding: "22px 24px", borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 24px" }}>
          <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 48, height: 48, borderRadius: 15, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" />
              </svg>
            </span>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700 }}>الطلب مجاني ومش بيلزمك بالشراء.</span>
              <span style={{ fontSize: 14, color: "#4A5A56" }}>هنبلغك على واتساب أول ما يتعرض جهاز مناسب.</span>
            </span>
          </div>
          <button type="submit" className="rq-cta" style={{ flex: "1 1 260px", minHeight: 58, padding: "0 24px", borderRadius: 16, border: 0, background: "#0D5C55", color: "#FFFFFF", font: "inherit", fontWeight: 700, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            ابعت الطلب
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M11 6l-6 6 6 6" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}
