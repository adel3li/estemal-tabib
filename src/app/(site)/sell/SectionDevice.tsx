"use client";

import { DEVICE_TYPES } from "@/lib/demo/labels";
import type { DeviceType } from "@/lib/demo/types";
import { bad, CardHead, grid, Msg, Star, type SectionProps } from "./ui";

export function SectionDevice({ f, set, err }: SectionProps) {
  return (
    <fieldset id="sl-s2" className="sl-card">
      <CardHead
        iconBg="#E6EDF7"
        iconFg="#24508F"
        step="الخطوة ٢ من ٦"
        stepFg="#24508F"
        title="٢. بيانات الجهاز"
        icon={
          <>
            <rect x="3" y="7" width="18" height="13" rx="3" />
            <path d="M8 7V5h8v2" />
            <circle cx="12" cy="13.5" r="3" />
          </>
        }
      />
      <div className="sl-body">
        <div style={grid(240)}>
          <label className="sl-field">
            <span>نوع الجهاز<Star /></span>
            <select {...bad("deviceType", err)} value={f.deviceType} onChange={(e) => set({ deviceType: e.target.value as DeviceType })} required>
              {DEVICE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="sl-field">
            <span>الماركة<Star /></span>
            <input type="text" {...bad("brand", err)} value={f.brand} onChange={(e) => set({ brand: e.target.value })} required />
            <Msg k="brand" err={err} />
          </label>
          <label className="sl-field">
            <span>تفاصيل الجهاز<Star /></span>
            <input type="text" placeholder="الموديل، السعة، المواصفات" {...bad("details", err)} value={f.details} onChange={(e) => set({ details: e.target.value })} required />
            <Msg k="details" err={err} />
          </label>
        </div>
        <label className="sl-field">
          <span>الملحقات اللي مع الجهاز<Star /></span>
          <textarea rows={2} placeholder="مثال: شاحن، 2 هاند بيس، فوت كنترول" {...bad("accessories", err)} value={f.accessories} onChange={(e) => set({ accessories: e.target.value })} required />
          <Msg k="accessories" err={err} />
        </label>
        <label className="sl-field">
          <span>سبب البيع<Star /></span>
          <input type="text" placeholder="مثال: ترقية لموديل أحدث" {...bad("saleReason", err)} value={f.saleReason} onChange={(e) => set({ saleReason: e.target.value })} required />
          <Msg k="saleReason" err={err} />
          <span style={{ fontWeight: 400, fontSize: 13, color: "#4A5A56", display: "flex", alignItems: "center", gap: 6 }}>
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            للمنصة بس، مش هيظهر للمشتري.
          </span>
        </label>
      </div>
    </fieldset>
  );
}
