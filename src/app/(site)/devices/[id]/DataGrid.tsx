import type { ReactNode } from "react";
import type { Device } from "@/lib/demo/types";
import { brandModel, COND_TILE, defectInfo, REPAIRED, svgProps } from "./helpers";

function Cell({ label, value, bg = "#F5F7F4", lab = "#4A5A56", fg }: { label: string; value: ReactNode; bg?: string; lab?: string; fg?: string }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 12, background: bg }}>
      <div style={{ fontSize: 13, color: lab }}>{label}</div>
      <div style={{ fontWeight: 700, color: fg }}>{value}</div>
    </div>
  );
}

export function DataGrid({ d }: { d: Device }) {
  const inspected = d.inspection === "inspected";
  const cond = COND_TILE[d.condition];
  return (
    <div style={{ marginTop: 10, padding: 24, borderRadius: 20, background: "#FFFFFF", border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>بيانات الجهاز</h2>
        {inspected ? (
          <a href="#report" style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            تقرير الفحص
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" {...svgProps} strokeWidth={2}><path d="M12 5v14" /><path d="M6 13l6 6 6-6" /></svg>
          </a>
        ) : (
          <span style={{ fontSize: 13, color: "#4A5A56" }}>حسب كلام البايع · هتتأكد في الفحص</span>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10 }}>
        {inspected ? (
          <>
            <Cell label="الماركة / الموديل" value={brandModel(d)} />
            <Cell label="سنة الصنع" value={d.year} />
            <Cell label="بلد المنشأ" value={d.origin} />
            <Cell label="الجهاز في" value={d.governorate} />
            {d.report ? <Cell label="كفاءة التشغيل" value={d.report.efficiency} bg="#E3F0ED" lab="#0B4A44" fg="#0D5C55" /> : null}
            <Cell label="عيوب مُعلنة" value={defectInfo(d).count} bg="#FBEEDC" lab="#6B3A10" fg="#8A4209" />
          </>
        ) : (
          <>
            <Cell label="الماركة" value={d.brand} />
            {d.capacity ? <Cell label="السعة" value={`${d.capacity} لتر`} /> : <Cell label="الموديل" value={d.model} />}
            <Cell label="سنة الصنع" value={d.year} />
            <Cell label="الحالة" value={cond.text} bg={cond.bg} lab={cond.lab} fg={cond.fg} />
            <Cell label="الكرتونة" value={d.hasBox === undefined ? "مش معروف" : d.hasBox ? "موجودة" : "مش موجودة"} />
            <Cell label="اتصلّح قبل كده؟" value={REPAIRED[d.repairedBefore ?? "unknown"]} />
          </>
        )}
      </div>
      {d.accessories ? (
        <div style={{ fontSize: 14, color: "#3C4C48" }}>
          <span style={{ fontWeight: 700 }}>الملحقات: </span>
          {d.accessories}
        </div>
      ) : null}
    </div>
  );
}
