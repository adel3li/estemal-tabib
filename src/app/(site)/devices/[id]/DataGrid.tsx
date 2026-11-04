// «المواصفات» — v2 spec list next to the report.
import type { ReactNode } from "react";
import type { Device } from "@/lib/demo/types";
import { categoryFields } from "@/lib/demo/labels";
import { brandModel, COND_TILE, defectInfo, REPAIRED } from "./helpers";

function Row({ label, value, tone }: { label: string; value: ReactNode; tone?: "ok" | "warn" }) {
  return (
    <>
      <dt>{label}</dt>
      <dd className={tone ? `li-spec-${tone}` : undefined}>{value}</dd>
    </>
  );
}

export function DataGrid({ d }: { d: Device }) {
  const inspected = d.inspection === "inspected";
  const cond = COND_TILE[d.condition];
  const defects = defectInfo(d).count;
  return (
    <div className="li-specs-box">
      <div className="li-specs-head">
        <h2 className="li-h2">المواصفات</h2>
        {!inspected ? <span>حسب كلام البايع · هتتأكد في الفحص</span> : null}
      </div>
      <dl className="li-specs">
        {inspected ? (
          <>
            <Row label="الماركة / الموديل" value={brandModel(d)} />
            <Row label="سنة الصنع" value={d.year} />
            <Row label="بلد المنشأ" value={d.origin} />
            {d.report ? <Row label="كفاءة التشغيل" value={d.report.efficiency} tone="ok" /> : null}
            <Row label="عيوب مُعلنة" value={defects} tone={defects ? "warn" : undefined} />
          </>
        ) : (
          <>
            <Row label="الماركة" value={d.brand} />
            {d.capacity ? <Row label="السعة" value={`${d.capacity} لتر`} /> : <Row label="الموديل" value={d.model} />}
            <Row label="سنة الصنع" value={d.year} />
            <Row label="الحالة" value={cond.text} tone={d.condition === "a" ? "ok" : d.condition === "c" ? "warn" : undefined} />
            <Row label="الكرتونة" value={d.hasBox === undefined ? "مش معروف" : d.hasBox ? "موجودة" : "مش موجودة"} />
            <Row label="اتصلّح قبل كده؟" value={REPAIRED[d.repairedBefore ?? "unknown"]} />
          </>
        )}
        {/* The category's own details (set in «الأنواع» in the dashboard). */}
        {categoryFields(d.type)
          .filter((x) => d.specs?.[x.key])
          .map((x) => (
            <Row key={x.key} label={x.label} value={`${d.specs?.[x.key]}${x.unit ? ` ${x.unit}` : ""}`} />
          ))}
        {d.accessories ? <Row label="الملحقات" value={d.accessories} /> : null}
      </dl>
    </div>
  );
}
