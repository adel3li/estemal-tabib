"use client";

// /sell page head, step rail and side notes — v2 direction
// (design-explorations/v2/src/sell.html, brand theme). The form itself stays
// one long page; the rail links to each section and marks the one in view.
import { useEffect, useState } from "react";
import { BUSINESS } from "@/config/business";
import { VIDEO_ENABLED } from "@/config/features";
import { fmt } from "@/lib/demo/labels";
import { NEXT_STEPS } from "./SellSuccess";

const STEPS = ["بياناتك", "بيانات الجهاز", "الحالة والعيوب", VIDEO_ENABLED ? "الصور والفيديو" : "الصور", "السعر", "الإقرارات"];

export function SellHead() {
  return (
    <div className="hm-wrap sl-head v2-head-art">
      <div>
        <div className="hm-eyebrow">بيع جهازك</div>
        <h1 className="sl-h1">اعرض جهازك للبيع</h1>
        <p className="sl-lead">كل ما كانت البيانات أدق، كل ما الجهاز اتباع أسرع. بعد ما تبعت الطلب هنكلمك خلال 24 ساعة نحدد ميعاد الفحص.</p>
      </div>
      <svg role="img" aria-label="رسم توضيحي لكرسي أسنان مع تقرير فحص وسعر" viewBox="0 0 520 380" className="v2-head-pic">
        <use href="#sl-hero" />
      </svg>
    </div>
  );
}

export function SellSteps() {
  const [on, setOn] = useState(0);

  useEffect(() => {
    const els = STEPS.map((_, i) => document.getElementById(`sl-s${i + 1}`)).filter((x): x is HTMLElement => !!x);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setOn(els.indexOf(hit.target as HTMLElement));
      },
      { rootMargin: "-90px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="خطوات النموذج" className="sl-rail">
      <ol className="sl-steps">
        {STEPS.map((label, i) => (
          <li key={label}>
            <a href={`#sl-s${i + 1}`} className={i < on ? "sl-step sl-step-done" : i === on ? "sl-step sl-step-on" : "sl-step"} aria-current={i === on ? "step" : undefined}>
              <span className="sl-step-n hm-num" aria-hidden="true">{i < on ? "✓" : i + 1}</span>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SellAside() {
  return (
    <aside className="sl-side" aria-label="معلومات قبل ما تبعت">
      <div className="sl-box-side">
        <h2>رسوم الجدية</h2>
        <div className="sl-side-fee">
          <span>بتبدأ من · حسب قيمة الجهاز</span>
          <b>{fmt(BUSINESS.sellerSeriousnessFeeEGP)} ج.م</b>
        </div>
        {/* docs/ADMIN_SPEC.md §2: nothing to pay now; the amount is set after review. */}
        <p>مش هتدفع حاجة دلوقتي. بنراجع طلبك خلال 24 ساعة، ولو اتقبل بنبلغك بقيمة الرسوم وإزاي تدفعها.</p>
      </div>
      <div className="sl-box-side">
        <h2>بعد ما تبعت</h2>
        <ol>
          {NEXT_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
