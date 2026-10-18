import { formatDate } from "@/lib/site";
import type { InspectionReport } from "@/lib/types";
import { InspectionChecklist } from "./InspectionChecklist";

/** Full inspection report: scores, checklist results and disclosed defects. */
export function InspectionReportView({ title, report }: { title: string; report: InspectionReport }) {
  const defects = report.disclosedDefects.length;
  const stats = [
    { label: "كفاءة التشغيل", value: report.operationScore, tone: "good" },
    { label: "الحالة الظاهرية", value: report.appearanceScore, tone: "good" },
    { label: "أجزاء اتغيرت", value: report.replacedParts.length ? report.replacedParts.join("، ") : "[القطع]", tone: "plain" },
    { label: "عيوب مُعلنة", value: defects.toLocaleString("ar-EG"), tone: defects ? "warn" : "plain" },
  ] as const;
  const toneClass = {
    good: ["bg-primary-soft", "text-primary"],
    plain: ["bg-ground", ""],
    warn: ["bg-warn-soft", "text-warn"],
  };

  return (
    <section id="report" className="flex flex-col gap-[26px] rounded-3xl border border-line bg-surface p-5 sm:p-[34px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="m-0 text-[28px]">تقرير الفحص</h2>
          <div className="text-muted">
            رقم التقرير [###] · تاريخ الفحص {formatDate(report.date)} · الرقم التسلسلي للجهاز {report.serialNumber ?? "[S/N]"}
          </div>
        </div>
        <div className="flex flex-col rounded-[14px] bg-ground px-4 py-3 text-sm">
          <span className="font-bold">فحص بواسطة</span>
          <span>د. {report.reviewingDentistName ?? "[اسم طبيب الأسنان]"} — مراجعة</span>
          <span>فني {report.technicianName ?? "[الاسم]"} — فحص فني</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-[18px] ${toneClass[s.tone][0]}`}>
            <div className="text-sm text-[#3C4C48]">{s.label}</div>
            <div className={`text-[22px] font-bold ${toneClass[s.tone][1]}`}>{s.value}</div>
          </div>
        ))}
      </div>
      <InspectionChecklist title={`قائمة الفحص — ${title}`} items={report.checklistItems} />
      {defects > 0 && (
        <div className="flex flex-col gap-3">
          {report.disclosedDefects.map((d) => (
            <div key={d.description} className="flex flex-wrap items-center gap-4 rounded-2xl bg-warn-tint p-[18px]">
              <div className="flex h-24 w-[140px] items-center justify-center rounded-xl bg-[#F3DFC2] text-[13px] text-[#6B3A10]">
                صورة العيب
              </div>
              <div className="min-w-0 flex-[1_1_280px]">
                <div className="font-bold">عيوب مُعلنة بوضوح</div>
                <div className="text-[#5A4A3C]">{d.description}</div>
                <div className="text-[#5A4A3C]">
                  بنعرض أي عيب في الجهاز بصورته قبل ما تشتري. اللي في التقرير هو اللي هتستلمه.
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
