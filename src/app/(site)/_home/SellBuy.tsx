// Seller / buyer split at the bottom of the home page (v2 direction).
import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { fmt } from "@/lib/demo/labels";
import { routes } from "@/lib/routes";

export function SellBuy() {
  return (
    <section id="sell" className="hm-sec hm-sec-top0">
      <div className="hm-wrap">
        <div className="hm-split">
          <div>
            <div className="hm-eyebrow">للبايع</div>
            <h2 className="hm-h2">عندك جهاز مش بتستخدمه؟</h2>
            <p className="hm-lede hm-lede-sm">صوّره، وإحنا نفحصه ونعرضه لدكاترة أسنان بيدوروا عليه.</p>
            <dl>
              <dt>رسوم جدية</dt>
              <dd><span className="hm-num">{fmt(BUSINESS.sellerSeriousnessFeeEGP)}</span> ج.م</dd>
              <dt>عمولة المنصة</dt>
              <dd>لحد <span className="hm-num">{Math.round(BUSINESS.platformFeeMaxRate * 100)}%</span> من سعر البيع</dd>
              <dt>فلوسك</dt>
              <dd>بتوصلك بعد مدة التجربة</dd>
            </dl>
            <div><Link href={routes.sell} className="hm-btn hm-btn-orange">بيع جهازك</Link></div>
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
