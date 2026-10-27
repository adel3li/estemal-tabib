"use client";

import { fmt, parseNum, typeLabel } from "@/lib/demo/labels";
import type { Submission } from "@/lib/demo/types";
import { SectionHead } from "./bits";
import { LOCATIONS, netOf, type FormState } from "./model";

type Props = {
  f: FormState;
  set: (patch: Partial<FormState>) => void;
  submissions: Submission[];
  onPickSubmission: (id: string) => void;
};

const SRC_OPTS: [FormState["src"], string, string][] = [
  ["company", "ملك الشركة", "جهاز اشترته الشركة أو موجود في مخزنها"],
  ["seller", "بالنيابة عن بايع", "من طلب بيع وصلنا من دكتور"],
];

export function SourceSection({ f, set, submissions, onPickSubmission }: Props) {
  const net = netOf(f);
  return (
    <section className="ad-card" aria-labelledby="ad-s1">
      <SectionHead id="ad-s1" n="١" bg="#E3F0ED" fg="#0D5C55">
        مصدر الجهاز
      </SectionHead>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {SRC_OPTS.map(([v, label, sub]) => {
          const on = f.src === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => set({ src: v })}
              aria-pressed={on}
              style={{
                padding: 16,
                borderRadius: 16,
                border: `2px solid ${on ? "#0D5C55" : "#DCE3DF"}`,
                background: on ? "#E3F0ED" : "#FFFFFF",
                font: "inherit",
                textAlign: "right",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                color: "#12221F",
              }}
            >
              <span style={{ fontWeight: 700 }}>{label}</span>
              <span style={{ fontSize: 13, color: "#4A5A56" }}>{sub}</span>
            </button>
          );
        })}
      </div>

      {f.src === "seller" ? (
        <>
          <div className="ad-grid">
            <label className="ad-field">
              رقم طلب البيع
              <select className="ad-in" value={f.submissionId} onChange={(e) => onPickSubmission(e.target.value)}>
                <option value="">اختار طلب بيع…</option>
                {submissions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} — {typeLabel(s.deviceType)} — {s.fullName}
                  </option>
                ))}
              </select>
              <span className="ad-hint">بيانات البايع وصوره بتتنقل من طلبه تلقائياً.</span>
            </label>
            <label className="ad-field">
              <span>
                صافي البايع (ج.م)<span className="ad-int">داخلي</span>
              </span>
              <input
                type="text"
                inputMode="numeric"
                className="ad-in"
                placeholder="بيتحسب من سعر البيع"
                value={f.netTouched ? f.sellerNet : net ? fmt(net) : ""}
                onChange={(e) => set({ sellerNet: e.target.value, netTouched: e.target.value.trim() !== "" })}
              />
            </label>
          </div>
          {f.saleReason ? (
            <div style={{ padding: "12px 16px", borderRadius: 14, background: "#FFF8EE", border: "1px dashed #F0C88A", fontSize: 14 }}>
              <span style={{ fontWeight: 600, color: "#8A4209" }}>
                سبب البيع<span className="ad-int">داخلي — مش بيظهر للمشتري</span>
              </span>
              <div>{f.saleReason}</div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="ad-grid">
          <label className="ad-field">
            <span>
              تكلفة الشراء على الشركة (ج.م)<span className="ad-int">داخلي</span>
            </span>
            <input
              type="text"
              inputMode="numeric"
              className="ad-in"
              placeholder="مثال: 30000"
              value={f.purchaseCost}
              onChange={(e) => set({ purchaseCost: e.target.value })}
            />
          </label>
          <label className="ad-field">
            مكان الجهاز دلوقتي
            <select className="ad-in" value={f.locationNow} onChange={(e) => set({ locationNow: e.target.value })}>
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      {f.src === "seller" && parseNum(f.price) > 0 && !f.submissionId ? (
        <div className="ad-hint" style={{ color: "#8A4209" }}>
          اختار طلب البيع عشان بيانات البايع تتربط بالإعلان.
        </div>
      ) : null}
    </section>
  );
}
