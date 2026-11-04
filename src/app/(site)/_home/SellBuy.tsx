"use client";

// Bottom of the home page, v2 split: the quick sell box (type + price → /sell,
// from the Main.dc.html port) beside the buyer's «اطلب جهاز» panel.
import Link from "next/link";
import { useState } from "react";
import { BUSINESS } from "@/config/business";
import { VIDEO_ENABLED } from "@/config/features";
import { DEVICE_TYPES, parseNum } from "@/lib/demo/labels";
import type { DeviceType } from "@/lib/demo/types";
import { routes } from "@/lib/routes";

const DAYS = BUSINESS.trialDays;

const Check = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

export function SellBuy() {
  const [type, setType] = useState<DeviceType>(DEVICE_TYPES[0].id);
  const [price, setPrice] = useState("");

  const qs = new URLSearchParams({ type });
  const priceNum = parseNum(price);
  if (priceNum) qs.set("price", String(priceNum));
  const sellHref = `${routes.sell}?${qs.toString()}`;

  return (
    <section id="sell" className="hm-sec hm-sec-top0">
      <div className="hm-wrap">
        <div className="hm-split hm-split-sell">
          <div>
            <div className="hm-eyebrow">للبايع</div>
            <h2 className="hm-h2">عندك جهاز عايز تبيعه؟</h2>
            <p className="hm-lede hm-lede-sm">اعرض جهازك في دقايق، وإحنا نتابع الفحص والتسعير والشحن والتحصيل. من غير وسطاء ولا مشترين مش جادين.</p>
            <ul className="hm-checks hm-ok">
              <li><Check />سعر عادل حسب حالة الجهاز وسعر السوق</li>
              <li><Check />المشترين دكاترة أسنان بس</li>
              <li><Check />فلوسك بتوصلك بعد {DAYS} أيام من استلام المشتري للجهاز</li>
            </ul>
            <form onSubmit={(e) => e.preventDefault()} className="hm-qsell">
              <label>
                نوع الجهاز
                <select value={type} onChange={(e) => setType(e.target.value as DeviceType)} className="hm-in">
                  {DEVICE_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </label>
              <label>
                السعر المطلوب
                <input type="text" inputMode="numeric" autoComplete="off" enterKeyHint="done" value={price} onChange={(e) => setPrice(e.target.value)} className="hm-in" placeholder="ج.م" />
              </label>
              <div className="hm-upload">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
                {VIDEO_ENABLED ? "ارفع صور وفيديو للجهاز وهو شغال" : "ارفع صور واضحة للجهاز من كل الزوايا"}
              </div>
              <Link href={sellHref} className="hm-btn hm-btn-orange">كمّل بيانات جهازك</Link>
            </form>
          </div>
          <div>
            <div className="hm-eyebrow">للمشتري</div>
            <h2 className="hm-h2">مش لاقي الجهاز اللي عايزه؟</h2>
            <p className="hm-lede hm-lede-sm">قولنا الجهاز والميزانية، وإحنا ندور لك عليه عند دكاترة تانيين ونبلغك أول ما نلاقيه.</p>
            <dl>
              <dt>بتكتب</dt>
              <dd>نوع الجهاز، الماركة، الميزانية</dd>
              <dt>إحنا</dt>
              <dd>بندور عند البياعين ونتواصل معاك</dd>
            </dl>
            <div><Link href={routes.request} className="hm-btn hm-btn-line">اطلب جهاز</Link></div>
          </div>
        </div>
      </div>
    </section>
  );
}
