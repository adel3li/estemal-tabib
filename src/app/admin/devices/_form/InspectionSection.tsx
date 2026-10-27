"use client";

import type { Condition, InspectionState } from "@/lib/demo/types";
import { Chips, DropButton, SectionHead } from "./bits";
import { EFFICIENCY, type FormState } from "./model";

type Props = {
  f: FormState;
  set: (patch: Partial<FormState>) => void;
  reportName: string;
  hasExistingReport: boolean;
  onReport: (name: string) => void;
};

export function InspectionSection({ f, set, reportName, hasExistingReport, onReport }: Props) {
  return (
    <section className="ad-card" aria-labelledby="ad-s3">
      <SectionHead id="ad-s3" n="٣" bg="#FBEEDC" fg="#8A4209">
        الفحص والحالة
      </SectionHead>
      <Chips<InspectionState>
        label="حالة الفحص"
        value={f.insp}
        options={[
          ["inspected", "تم الفحص"],
          ["on_order", "يُفحص عند الطلب"],
        ]}
        onPick={(v) => set({ insp: v })}
      />
      {f.insp === "inspected" ? (
        <div style={{ padding: 16, borderRadius: 16, background: "#E3F0ED", border: "1px solid #9CCBC2", display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="ad-grid">
            <label className="ad-field">
              الفني اللي فحص
              <input type="text" className="ad-in" value={f.technician} onChange={(e) => set({ technician: e.target.value })} placeholder="[اسم الفني المعتمد]" />
            </label>
            <label className="ad-field">
              تاريخ الفحص
              <input type="date" className="ad-in" value={f.inspDate} onChange={(e) => set({ inspDate: e.target.value })} />
            </label>
            <label className="ad-field">
              كفاءة التشغيل
              <select className="ad-in" value={f.efficiency} onChange={(e) => set({ efficiency: e.target.value })}>
                {EFFICIENCY.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          <DropButton
            accept="application/pdf,image/*"
            iconBg="#0D5C55"
            title="ارفع تقرير الفحص"
            hint="PDF أو صور، أو املاه من نموذج الفحص"
            status={reportName ? `اترفع: ${reportName}` : hasExistingReport ? "فيه تقرير فحص مرفوع للجهاز ده" : undefined}
            onFiles={(files) => onReport(files.map((x) => x.name).join("، "))}
            multiple
            icon={
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 3h7l5 5v13H7z" />
                <path d="M14 3v5h5" />
                <path d="M10 13l2 2 4-4" />
              </svg>
            }
          />
        </div>
      ) : null}
      <Chips<Condition>
        label="حالة المنتج"
        value={f.cond}
        options={[
          ["a", "ممتازة 81–100%"],
          ["b", "جيدة 60–80%"],
          ["c", "أقل من 60%"],
        ]}
        onPick={(v) => set({ cond: v })}
      />
      <label className="ad-field">
        العيوب المعلنة
        <textarea className="ad-in" value={f.defects} onChange={(e) => set({ defects: e.target.value })} placeholder="اكتب كل عيب بوضوح، هيظهر للمشتري" />
      </label>
    </section>
  );
}
