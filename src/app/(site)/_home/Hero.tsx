"use client";

// Home hero, v2 direction (design-explorations/v2/src/home.html, brand theme):
// dark petrol band, the headline + 3 facts, and an inspection report card built
// from a real listed device's report (featured first).
import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";
import { isListed, useDemo } from "@/lib/demo/store";
import type { Device } from "@/lib/demo/types";
import { DrawnUnderline } from "./DrawnUnderline";
import { artFor } from "./artMap";

const DAYS = BUSINESS.trialDays;
const [M1, M2] = BUSINESS.maintenanceMonthsOptions;
const ROWS = 4;

export function Hero() {
  const { state } = useDemo();
  const listed = state.devices.filter(isListed);
  const withReport = (d: Device) => d.inspection === "inspected" && !!d.report;
  const d = listed.find((x) => x.featured && withReport(x)) ?? listed.find(withReport);

  return (
    <section className="hm-hero">
      <div className="hm-wrap hm-hero-grid">
        <div className="hm-hero-copy">
          <div className="hm-eyebrow">سوق أجهزة الأسنان المستعملة في مصر</div>
          <h1 className="hm-h1">
            من طبيب أسنان
            <br />
            لطبيب أسنان…{" "}
            <span className="hm-h1-em">
              بثقة
              <DrawnUnderline />
            </span>
          </h1>
          <p className="hm-lede">
            كل جهاز بيتفحص بواسطة فني معتمد، وفلوسك بتفضل محفوظة معانا لحد ما تستلم الجهاز وتجربه بنفسك {DAYS} أيام.
          </p>
          <div className="hm-ctas">
            <Link href={routes.devices} className="hm-btn hm-btn-orange">تصفح الأجهزة</Link>
            <Link href={routes.sell} className="hm-tlink">
              عندك جهاز؟ اعرضه للبيع <span aria-hidden="true">←</span>
            </Link>
          </div>
          <dl className="hm-facts">
            <div><dt>فني معتمد</dt><dd>بيفحص الجهاز ويكتب تقرير</dd></div>
            <div><dt>{DAYS} أيام</dt><dd>تجربة، وفلوسك محفوظة معانا</dd></div>
            <div><dt>{M1}–{M2} شهور</dt><dd>صيانة مجانية مكتوبة</dd></div>
          </dl>
        </div>
        {d ? <ReportCard d={d} /> : null}
      </div>
    </section>
  );
}

function ReportCard({ d }: { d: Device }) {
  const r = d.report!;
  const rows: { label: string; value: string; note?: boolean }[] = [
    { label: "كفاءة التشغيل", value: r.efficiency },
    { label: "الحالة الخارجية", value: r.appearance },
    ...r.checklist.slice(0, ROWS - 2).map((c) => ({
      label: c.label.split(" — ")[0],
      value: c.result === "pass" ? "سليم" : c.result === "note" ? "ملاحظة" : "عطل",
      note: c.result !== "pass",
    })),
  ];
  const passed = r.checklist.filter((c) => c.result === "pass").length;

  return (
    <Link href={routes.device(d.id)} className="hm-cert" aria-label={`تقرير فحص ${d.title}`}>
      <div className="hm-cert-top">
        <b>تقرير فحص فني</b>
        <span className="hm-num">{r.no} · {r.date}</span>
      </div>
      <div className="hm-cert-dev">
        <span className="hm-ph">
          <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><use href={artFor(d.type)} /></svg>
        </span>
        <div>
          <h2 className="hm-cert-title">{d.title}</h2>
          <div className="hm-meta">
            {d.year} · {d.governorate} · كود الجهاز <span className="hm-num">{d.id}</span>
          </div>
        </div>
      </div>
      <ul className="hm-rows">
        {rows.map((row) => (
          <li key={row.label} className="hm-row">
            <span>{row.label}</span>
            <span className={row.note ? "hm-grade hm-grade-note" : "hm-grade"}>{row.value}</span>
          </li>
        ))}
        <li className="hm-row hm-row-sum">
          <span>بنود الفحص</span>
          <span className="hm-grade">{passed} من {r.checklist.length} سليم</span>
        </li>
      </ul>
      <div className="hm-cert-foot">
        <div className="hm-sig">
          <div className="hm-sig-line">م. {r.technician}</div>
          فني معتمد — شوف التقرير كامل ←
        </div>
        <div className="hm-stamp" aria-hidden="true">
          <div><b>تم<br />الفحص</b><small>{r.no}</small></div>
        </div>
      </div>
    </Link>
  );
}
