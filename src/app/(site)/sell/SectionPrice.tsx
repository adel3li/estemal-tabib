"use client";

import { salePriceFromSellerNet, sellerNetFromSalePrice } from "@/config/business";
import { parseNum } from "@/lib/demo/labels";
import type { SellForm } from "./form";
import { bad, CardHead, grid, Msg, radioStyle, Star, type SectionProps } from "./ui";

export function SectionPrice({ f, set, err }: SectionProps) {
  const onSale = (t: string) => {
    const x = parseNum(t);
    set({ sale: t, net: x ? String(sellerNetFromSalePrice(x)) : "" });
  };
  const onNet = (t: string) => {
    const x = parseNum(t);
    set({ net: t, sale: x ? String(salePriceFromSellerNet(x)) : "" });
  };
  const keep = (v: SellForm["keepLocation"]) => set({ keepLocation: v });

  return (
    <fieldset id="sl-s5" className="sl-card">
      <CardHead
        iconBg="#E3F0ED"
        iconFg="#0D5C55"
        step="الخطوة ٥ من ٦"
        stepFg="#0D5C55"
        title="٥. السعر"
        icon={
          <>
            <path d="M3 12V4h8l10 10-8 8z" />
            <circle cx="7.5" cy="8.5" r="1.5" />
          </>
        }
      />
      <div className="sl-body">
        <fieldset style={{ margin: 0, padding: 0, border: 0, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <legend style={{ padding: 0, marginBottom: 10, fontWeight: 600, fontSize: 14, color: "#24332F" }}>
            الجهاز هيفضل فين لحد ما يتباع؟<Star />
          </legend>
          <div style={grid(260, 12)}>
            <label className="sl-opt">
              <input type="radio" name="keep" checked={f.keepLocation === "with_seller"} onChange={() => keep("with_seller")} style={radioStyle(20, "3px 0 0")} required />
              <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11l9-7 9 7" />
                    <path d="M5 10v10h14V10" />
                    <path d="M10 20v-6h4v6" />
                  </svg>
                  يفضل معايا
                </span>
                <span style={{ fontSize: 14, color: "#4A5A56" }}>الجهاز بيتفحص عندك لما حد يطلبه.</span>
              </span>
            </label>
            <label className="sl-opt sl-opt-rec">
              <input type="radio" name="keep" checked={f.keepLocation === "send_to_platform"} onChange={() => keep("send_to_platform")} style={radioStyle(20, "3px 0 0")} />
              <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7h11v9H3z" />
                    <path d="M14 10h4l3 3v3h-7" />
                    <circle cx="7" cy="17.5" r="1.8" />
                    <circle cx="17" cy="17.5" r="1.8" />
                  </svg>
                  <span style={{ fontWeight: 700 }}>أبعته يتفحص ويفضل عندكم</span>
                  <span style={{ padding: "1px 10px", borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontSize: 12, fontWeight: 600 }}>فرص بيع أعلى</span>
                </span>
                <span style={{ fontSize: 14, color: "#3C4C48" }}>بنفحص جهازك ويفضل عندنا لحد ما يتباع، فيوصل للمشتري أسرع. وتقدر ترجّعه في أي وقت، بس بتدفع تكلفة الشحن.</span>
              </span>
            </label>
          </div>
        </fieldset>

        <div className="sl-box" style={{ padding: 20, borderRadius: 18, background: "#F9FBFA", border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 14, color: "#4A5A56", display: "flex", alignItems: "center", gap: 8 }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
              <path d="M7 7h11l-3-3" />
              <path d="M17 17H6l3 3" />
            </svg>
            اكتب في أي خانة من الاتنين، والتانية هتتحسب لوحدها.
          </span>
          <div className="sl-price-row">
            <label className="sl-field" style={{ flex: "1 1 220px" }}>
              <span>
                سعر البيع للمشتري (ج.م)
                {f.priceHelp ? null : <Star />}
              </span>
              <input type="text" inputMode="numeric" value={f.sale} onChange={(e) => onSale(e.target.value)} enterKeyHint="next" placeholder="مثال: 10000" {...bad("sale", err, "sl-in sl-in-big")} required={!f.priceHelp} />
            </label>
            <span aria-hidden="true" className="sl-swap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6" />
                <path d="M8 8l-4 4 4 4" />
                <path d="M16 8l4 4-4 4" />
              </svg>
            </span>
            <label className="sl-field" style={{ flex: "1 1 220px" }}>
              المبلغ اللي هيوصلك (ج.م)
              <input type="text" inputMode="numeric" value={f.net} onChange={(e) => onNet(e.target.value)} enterKeyHint="done" placeholder="مثال: 8500" className="sl-in sl-in-big sl-in-net" />
            </label>
          </div>
          <Msg k="sale" err={err} />
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "#E3F0ED", color: "#0B4A44", display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15 }}>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 3 }}>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <span>سعر البيع للمشتري هو الحد الأقصى. ممكن المشتري ياخد الجهاز بسعر أقل، بس المبلغ اللي هيوصلك ثابت ومش هيقل.</span>
        </div>
        <label className="sl-ack" style={{ fontSize: 15, alignItems: "center" }}>
          <input type="checkbox" checked={f.priceHelp} onChange={(e) => set({ priceHelp: e.target.checked })} style={radioStyle(22)} />
          <span>مش متأكد من السعر؟ ساعدوني أحدد سعر عادل حسب حالة الجهاز والسوق</span>
        </label>
      </div>
    </fieldset>
  );
}
