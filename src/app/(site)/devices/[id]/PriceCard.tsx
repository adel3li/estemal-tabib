// Buy column on the device page — v2 «buy» block: title, price, the inspection
// box, order buttons and the promise list (money held, return, maintenance, delivery).
import Link from "next/link";
import type { ReactNode } from "react";
import { BUSINESS } from "@/config/business";
import type { Device } from "@/lib/demo/types";
import { fmt, typeLabel } from "@/lib/demo/labels";
import { routes } from "@/lib/routes";
import { waLink } from "@/lib/whatsapp";
import { askMessage, brandModel, orderMessage, svgProps } from "./helpers";

const ic = (w = 18) => ({ "aria-hidden": true, width: w, height: w, viewBox: "0 0 24 24", ...svgProps, strokeWidth: 1.9 }) as const;
const ph = (x: string) => !x || x.startsWith("[");

function PromiseRow({ icon, title, text }: { icon: ReactNode; title: ReactNode; text: ReactNode }) {
  return (
    <li>
      {icon}
      <div><b>{title}</b><span>{text}</span></div>
    </li>
  );
}

export function PriceCard({ d, promo, onPromo }: { d: Device; promo: string; onPromo: (v: string) => void }) {
  const inspected = d.inspection === "inspected";
  const days = BUSINESS.trialDays;
  const unavailable = d.status === "reserved" || d.status === "sold";
  const subtitle = brandModel(d);
  const r = d.report;

  return (
    <div className="li-buy">
      <div className="hm-eyebrow">{typeLabel(d.type)} · <span className="hm-num">{d.id}</span></div>
      <h1 className="li-h1">{d.title} — {subtitle}</h1>
      <div className="li-sub">
        {!ph(d.year) || inspected ? <span>سنة الصنع {d.year}</span> : null}
        {inspected ? <span>بلد المنشأ {d.origin}</span> : null}
        <span>{d.governorate}</span>
      </div>

      {unavailable ? (
        <div role="status" className={d.status === "sold" ? "li-flag" : "li-flag li-flag-warn"}>
          {d.status === "sold" ? "الجهاز ده اتباع" : "الجهاز ده محجوز دلوقتي"}
        </div>
      ) : null}

      <div className="li-price"><span className="hm-num">{fmt(d.price)}</span><small>ج.م</small></div>
      <div className="li-note">في نطاق السعر العادل للسوق</div>

      {inspected ? (
        <div className="li-verified">
          <span className="li-verified-ic">
            <svg {...ic(20)} strokeWidth={2}><path d="M5 12l4 4 10-10" /></svg>
          </span>
          <div>
            <b>تم الفحص بواسطة فني معتمد</b>
            <span>{r ? `تقرير ${r.no} · اتفحص يوم ${r.date}` : "التقرير متاح على الصفحة"}</span>
          </div>
          <a href="#report">اقرا التقرير</a>
        </div>
      ) : (
        <div className="li-verified li-verified-ord">
          <span className="li-verified-ic">
            <svg {...ic(20)}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
          </span>
          <div>
            <b>يُفحص عند الطلب</b>
            <span>الفحص بيتم خلال {days} أيام عمل من طلبك، وتقرير الفحص بيوصلك قبل الشحن. لو مطلعش مطابق، فلوسك بترجعلك كاملة.</span>
          </div>
        </div>
      )}

      <div id="li-order-actions" className="li-ctas">
        {unavailable ? (
          <button type="button" disabled className="hm-btn li-btn-brand">
            {d.status === "sold" ? "الجهاز ده اتباع" : "الجهاز ده محجوز دلوقتي"}
          </button>
        ) : (
          // Phase 1 (PHASE1_PROMPT §9): ordering happens on WhatsApp; orders are Phase 2.
          // The discount code rides along in the message; the team checks it by hand.
          <>
          <label className="li-promo">
            عندك كود خصم؟
            <input
              type="text"
              value={promo}
              onChange={(e) => onPromo(e.target.value)}
              placeholder="اكتب الكود هنا"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              enterKeyHint="done"
            />
            <span>الكود بيتبعت مع طلبك، وبنأكدلك الخصم على واتساب.</span>
          </label>
          <a href={waLink(orderMessage(d, promo))} target="_blank" rel="noopener noreferrer" className="hm-btn li-btn-brand">
            {inspected ? "اطلب الجهاز" : "اطلب الجهاز وابدأ الفحص"}
          </a>
          </>
        )}
        <a href={waLink(askMessage(d))} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-line li-btn-full">
          <svg {...ic(20)} strokeWidth={1.8}><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" /></svg>
          اسأل عن الجهاز على واتساب
        </a>
        <div className="li-deposit">
          تقدر تحجز الجهاز بـ <span className="hm-num">{fmt(BUSINESS.buyerReservationDepositEGP)}</span> ج.م بحد أدنى، وبتتخصم من سعره. <Link href={routes.termsBuyer}>شروط الشراء</Link>
        </div>
      </div>

      <ul className="li-promise">
        <PromiseRow
          icon={<svg {...ic()}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>}
          title="فلوسك محفوظة معانا"
          text={`البايع مش بياخدها غير بعد ${days} أيام من استلامك`}
        />
        <PromiseRow
          icon={<svg {...ic()}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>}
          title={`استبدال أو استرجاع خلال ${days} أيام`}
          text={`وضمان تشغيل ${days} أيام`}
        />
        <PromiseRow
          icon={<svg {...ic()}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" /></svg>}
          title={`صيانة ${d.maintenanceMonths} شهور`}
          text="مكتوبة في الضمان مع الجهاز"
        />
        <PromiseRow
          icon={<svg {...ic()}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>}
          title="التوصيل لحد بابك"
          text={
            inspected
              ? `خلال ${BUSINESS.deliveryDaysInspected} أيام عمل`
              : `${BUSINESS.deliveryDaysWithInspection} أيام عمل شاملة الفحص · ${BUSINESS.deliveryDaysInspected} لو الجهاز تم فحصه`
          }
        />
      </ul>
    </div>
  );
}
