"use client";

// /request page head, step rail and side notes — v2 direction
// (design-explorations/v2/src/request.html, brand theme). The form stays one
// page; the rail links to each section and marks the one in view.
import Link from "next/link";
import { useEffect, useState } from "react";
import { typeLabel } from "@/lib/demo/labels";
import { isListed, useDemo } from "@/lib/demo/store";
import type { DeviceType } from "@/lib/demo/types";
import { routes } from "@/lib/routes";

const STEPS = ["الجهاز اللي محتاجه", "الميزانية والتوقيت", "بياناتك"];

export function RequestHead() {
  return (
    <div className="rq-head-page v2-head-art">
      <div>
        <div className="hm-eyebrow">مش لاقي الجهاز اللي محتاجه؟</div>
        <h1 className="rq-h1">اطلب جهاز</h1>
        <p className="rq-lead">قولنا محتاج إيه وميزانيتك كام، وهنبلغك على واتساب أول ما يتعرض جهاز مناسب. الطلب مجاني ومش بيلزمك بالشراء.</p>
      </div>
      <svg role="img" aria-label="رسم توضيحي لموبايل بيوصله تنبيه بجهاز مناسب" viewBox="0 0 520 380" className="v2-head-pic">
        <use href="#rq-hero" />
      </svg>
    </div>
  );
}

export function RequestSteps() {
  const [on, setOn] = useState(0);

  useEffect(() => {
    const els = STEPS.map((_, i) => document.getElementById(`rq-s${i + 1}`)).filter((x): x is HTMLElement => !!x);
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
    <nav aria-label="خطوات النموذج" className="rq-rail">
      <ol className="rq-steps">
        {STEPS.map((label, i) => (
          <li key={label}>
            <a href={`#rq-s${i + 1}`} className={i < on ? "rq-step rq-step-done" : i === on ? "rq-step rq-step-on" : "rq-step"} aria-current={i === on ? "step" : undefined}>
              <span className="rq-step-n hm-num" aria-hidden="true">{i < on ? "✓" : i + 1}</span>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function RequestAside({ type }: { type: DeviceType }) {
  const { state } = useDemo();
  const n = state.devices.filter((d) => isListed(d) && d.type === type).length;

  return (
    <aside className="rq-side" aria-label="معلومات عن الطلب">
      <div className="rq-box-side">
        <h2>بيحصل إيه بعد كده؟</h2>
        <ol>
          <li>بندور لك على الجهاز عند البياعين.</li>
          <li>هنبلغك على واتساب أول ما يتعرض جهاز مناسب.</li>
          <li>الطلب مجاني ومش بيلزمك بالشراء.</li>
        </ol>
      </div>
      <div className="rq-box-side rq-box-tint" aria-live="polite">
        <h2>متاح دلوقتي</h2>
        <p>
          {n ? (
            <>
              <span className="hm-num">{n}</span> {typeLabel(type)} معروض ·{" "}
              <Link href={`${routes.devices}?cat=${type}`} className="hm-tlink">شوفهم</Link>
            </>
          ) : (
            <>مفيش {typeLabel(type)} معروض دلوقتي، ابعت الطلب وهنبلغك.</>
          )}
        </p>
      </div>
    </aside>
  );
}
