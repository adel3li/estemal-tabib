// «تقرير الفحص» — v2 certificate: summary, checklist table, declared defects,
// technician signature and the «تم الفحص» stamp.
import type { Device } from "@/lib/demo/types";
import { typeLabel } from "@/lib/demo/labels";
import { defectInfo } from "./helpers";

export function Report({ d }: { d: Device }) {
  const r = d.report;
  const { count } = defectInfo(d);
  const defects = r ? r.defects : d.declaredDefects ? [d.declaredDefects] : [];
  return (
    <section id="report" className="li-report">
      <div className="li-report-top">
        <svg role="img" aria-label="رسم توضيحي لتقرير الفحص" viewBox="0 0 200 150" className="li-insp"><use href="#li-insp" /></svg>
        <div>
          <h2 className="li-h2">تقرير الفحص</h2>
          <span>
            {r ? `رقم التقرير ${r.no} · تاريخ الفحص ${r.date} · الرقم التسلسلي للجهاز ${r.serial}` : "الفحص اتعمل بواسطة فني معتمد — التفاصيل الكاملة بتوصلك على واتساب لو طلبتها."}
          </span>
        </div>
      </div>

      <dl className="li-sums">
        {r ? (
          <>
            <div><dt>كفاءة التشغيل</dt><dd className="li-spec-ok">{r.efficiency}</dd></div>
            <div><dt>الحالة الظاهرية</dt><dd className="li-spec-ok">{r.appearance}</dd></div>
            <div><dt>أجزاء اتغيرت</dt><dd>{r.replacedParts}</dd></div>
          </>
        ) : null}
        <div><dt>عيوب مُعلنة</dt><dd className={count ? "li-spec-warn" : undefined}>{count}</dd></div>
      </dl>

      {r && r.checklist.length ? (
        <table className="li-table">
          <caption>قائمة الفحص — {typeLabel(d.type)}</caption>
          <thead>
            <tr><th scope="col">البند</th><th scope="col">التقييم</th></tr>
          </thead>
          <tbody>
            {r.checklist.map((c, k) => {
              const [label, ...rest] = c.label.split(" — ");
              const note = [rest.join(" — "), c.note].filter(Boolean).join(" — ");
              return (
                <tr key={k} className={c.result === "pass" ? undefined : "li-tr-note"}>
                  <td>
                    {label}
                    {note ? <span className="li-td-note">{note}</span> : null}
                  </td>
                  <td className="li-td-g">{c.result === "pass" ? "سليم" : c.result === "note" ? "ملاحظة" : "عطل"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}

      {defects.length ? (
        <div className="li-defects">
          <div className="li-defect-img">
            <svg role="img" aria-label="صورة العيب" viewBox="0 0 400 300"><use href="#li-defect" /></svg>
          </div>
          <div style={{ flex: "1 1 240px", minWidth: 0 }}>
            <b>عيوب مُعلنة بوضوح</b>
            <p>بنعرض أي عيب في الجهاز بصورته قبل ما تشتري. اللي في التقرير هو اللي هتستلمه.</p>
            {r ? (
              <ul>
                {r.defects.map((x) => <li key={x}>{x}</li>)}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="li-report-foot">
        <div className="hm-sig">
          <div className="hm-sig-line">{r ? `م. ${r.technician}` : "فني معتمد"}</div>
          فني معتمد
        </div>
        <div className="hm-stamp" aria-hidden="true">
          <div><b>تم<br />الفحص</b>{r ? <small>{r.no}</small> : null}</div>
        </div>
      </div>
    </section>
  );
}
