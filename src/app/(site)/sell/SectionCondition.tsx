"use client";

import type { Condition, YesNoUnknown } from "@/lib/demo/types";
import { fieldId, type FieldKey, type YesNo } from "./form";
import { bad, CardHead, grid, Msg, radioStyle, Star, subLegend, type SectionProps } from "./ui";

const COND: { id: Condition; range: string; label: string; bars: [string, string, string] }[] = [
  { id: "a", range: "81% – 100%", label: "ممتاز", bars: ["#3F7A1F", "#3F7A1F", "#3F7A1F"] },
  { id: "b", range: "60% – 80%", label: "جيد", bars: ["#F2A33A", "#F2A33A", "#DCE3DF"] },
  { id: "c", range: "أقل من 60%", label: "محتاج صيانة", bars: ["#C46A12", "#DCE3DF", "#DCE3DF"] },
];

function Pills<T extends string>({
  name,
  value,
  options,
  onPick,
  invalid,
}: {
  name: FieldKey;
  value: T | "";
  options: { v: T; label: string }[];
  onPick: (v: T) => void;
  invalid: boolean;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((o, i) => (
        <label key={o.v} className={invalid ? "sl-pill sl-bad-box" : "sl-pill"}>
          <input type="radio" name={name} id={i === 0 ? fieldId(name) : undefined} checked={value === o.v} onChange={() => onPick(o.v)} style={radioStyle(18)} required={i === 0} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

const YES_NO: { v: Exclude<YesNo, "">; label: string }[] = [
  { v: "yes", label: "أيوه" },
  { v: "no", label: "لأ" },
];
const YES_NO_UNKNOWN: { v: YesNoUnknown; label: string }[] = [...YES_NO, { v: "unknown", label: "مش عارف" }];

export function SectionCondition({ f, set, err }: SectionProps) {
  return (
    <fieldset id="sl-s3" className="sl-card">
      <CardHead
        iconBg="#FBEEDC"
        iconFg="#C46A12"
        step="الخطوة ٣ من ٦"
        stepFg="#8A4209"
        title="٣. حالة الجهاز والعيوب"
        icon={
          <>
            <rect x="5" y="4" width="14" height="17" rx="2" />
            <path d="M9 4V3h6v1" />
            <path d="M9 12l2 2 4-4" />
          </>
        }
      />
      <div className="sl-body">
        <fieldset style={{ margin: 0, padding: 0, border: 0, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <legend style={{ padding: 0, marginBottom: 10, fontWeight: 600, fontSize: 14, color: "#24332F" }}>
            حالة الجهاز العامة<Star />
          </legend>
          <div style={grid(200, 10)}>
            {COND.map((c, i) => (
              <label key={c.id} className={err.condition ? "sl-cond sl-bad-box" : "sl-cond"}>
                <input type="radio" name="condition" id={i === 0 ? fieldId("condition") : undefined} checked={f.condition === c.id} onChange={() => set({ condition: c.id })} style={radioStyle(20)} required={i === 0} />
                <span style={{ flex: 1, display: "flex", flexDirection: "column", lineHeight: 1.35 }}>
                  <span style={{ fontWeight: 700, fontSize: 17 }}>{c.range}</span>
                  <span style={{ fontSize: 13, color: "#4A5A56" }}>{c.label}</span>
                </span>
                <span aria-hidden="true" style={{ display: "flex", gap: 3 }}>
                  {c.bars.map((b, j) => (
                    <span key={j} style={{ width: 8, height: 22, borderRadius: 4, background: b }} />
                  ))}
                </span>
              </label>
            ))}
          </div>
          <Msg k="condition" err={err} />
          <span style={{ fontSize: 13, color: "#4A5A56" }}>تقديرك المبدئي، والفحص هو اللي بيحدد الحالة النهائية.</span>
        </fieldset>

        <div className="sl-box" style={{ padding: 20, borderRadius: 18, border: "2px solid #0D5C55", background: "#F2F8F6", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" />
              </svg>
            </span>
            <span style={{ fontWeight: 700, fontSize: 17 }}>جهازك فيه عطل؟ نصلّحه ونعرضه للبيع</span>
          </div>
          <span style={{ fontSize: 15, color: "#3C4C48" }}>بدل ما تبيعه بسعر أقل، سيبنا نصلّحه الأول، فيتباع أسرع وبسعر أحسن.</span>
          <label className="sl-ack" style={{ background: "#FFFFFF", fontSize: 15, fontWeight: 600, alignItems: "center" }}>
            <input type="checkbox" checked={f.wantsRepair} onChange={(e) => set({ wantsRepair: e.target.checked })} style={radioStyle(22)} />
            أيوه، عايز تصلّحوه وتعرضوه للبيع
          </label>
          <label className="sl-field">
            <span>
              اوصف العطل
              {f.wantsRepair ? <Star /> : null}
            </span>
            <textarea rows={2} placeholder="مثال: الموتور بيفصل بعد دقيقة شغل" {...bad("repairDescription", err)} value={f.repairDescription} onChange={(e) => set({ repairDescription: e.target.value })} />
            <Msg k="repairDescription" err={err} />
          </label>
          <span style={{ fontSize: 13, color: "#4A5A56" }}>هنبعتلك تكلفة الإصلاح بعد الفحص، ومش هنبدأ غير بعد موافقتك.</span>
        </div>

        <div style={grid(260, 14)}>
          <fieldset className="sl-sub">
            <legend style={subLegend}>
              الجهاز عليه ضمان؟<Star />
            </legend>
            <Pills name="warranty" value={f.warranty} options={YES_NO} onPick={(v) => set({ warranty: v })} invalid={!!err.warranty} />
            <Msg k="warranty" err={err} />
            <label className="sl-field">
              لو عليه ضمان، فاضل قد إيه؟
              <input type="text" placeholder="مثال: 8 شهور" className="sl-in" value={f.warrantyRemaining} onChange={(e) => set({ warrantyRemaining: e.target.value })} />
            </label>
          </fieldset>
          <fieldset className="sl-sub" style={{ alignSelf: "start" }}>
            <legend style={subLegend}>
              كرتونة الجهاز الأصلية معاك؟<Star />
            </legend>
            <Pills name="box" value={f.box} options={YES_NO} onPick={(v) => set({ box: v })} invalid={!!err.box} />
            <Msg k="box" err={err} />
          </fieldset>
          <fieldset className="sl-sub">
            <legend style={subLegend}>
              هل الجهاز اتصلّح قبل كده؟<Star />
            </legend>
            <Pills name="repaired" value={f.repaired} options={YES_NO_UNKNOWN} onPick={(v) => set({ repaired: v })} invalid={!!err.repaired} />
            <Msg k="repaired" err={err} />
            <label className="sl-field">
              لو اتصلّح، اتصلّح فيه إيه؟
              <input type="text" placeholder="مثال: تغيير بلي الموتور" className="sl-in" value={f.repairedDetails} onChange={(e) => set({ repairedDetails: e.target.value })} />
            </label>
          </fieldset>
        </div>
        <label className="sl-field">
          <span>اكتب كل العيوب الظاهرة أو الخفية بأمانة<Star /></span>
          <textarea rows={4} placeholder="لو مفيش عيوب اكتب: لا يوجد" {...bad("defects", err)} value={f.defects} onChange={(e) => set({ defects: e.target.value })} required />
          <Msg k="defects" err={err} />
        </label>
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "#FBEEDC", border: "1px solid #F0C88A", color: "#6B3A10", fontSize: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ width: 24, height: 24, borderRadius: 999, background: "#F2A33A", color: "#12221F", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>!</span>
          <span>لو الفحص أثبت إن الجهاز مش مطابق للوصف أو فيه عيب مش مذكور، رسوم الجدية بتتصادر.</span>
        </div>
      </div>
    </fieldset>
  );
}
