"use client";

import { DEVICE_TYPES, GOVERNORATES } from "@/lib/demo/labels";
import type { DeviceType } from "@/lib/demo/types";
import { Req, SectionHead } from "./bits";
import type { FormState } from "./model";

type Props = { f: FormState; set: (patch: Partial<FormState>) => void };

export function DetailsSection({ f, set }: Props) {
  // Keep a governorate from old data selectable even if it isn't one of the 27 (e.g. «طنطا»).
  const govs: string[] = (GOVERNORATES as readonly string[]).includes(f.governorate) ? [...GOVERNORATES] : [f.governorate, ...GOVERNORATES];
  return (
    <section className="ad-card" aria-labelledby="ad-s2">
      <SectionHead id="ad-s2" n="٢" bg="#E6EDF7" fg="#24508F">
        بيانات الجهاز
      </SectionHead>
      <div className="ad-grid">
        <label className="ad-field">
          <span>
            اسم الجهاز في الإعلان
            <Req />
          </span>
          <input type="text" className="ad-in" value={f.title} onChange={(e) => set({ title: e.target.value })} placeholder="مثال: أوتوكلاف Class B" required />
        </label>
        <label className="ad-field">
          <span>
            نوع الجهاز
            <Req />
          </span>
          <select className="ad-in" value={f.type} onChange={(e) => set({ type: e.target.value as DeviceType })} required>
            {DEVICE_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="ad-field">
          <span>
            الماركة
            <Req />
          </span>
          <input type="text" className="ad-in" value={f.brand} onChange={(e) => set({ brand: e.target.value })} required />
        </label>
        <label className="ad-field">
          <span>
            تفاصيل الجهاز
            <Req />
          </span>
          <input
            type="text"
            className="ad-in"
            value={f.model}
            onChange={(e) => set({ model: e.target.value })}
            placeholder="الموديل، السعة، المواصفات"
            required
          />
        </label>
        <label className="ad-field">
          سنة الصنع
          <input type="text" inputMode="numeric" className="ad-in" value={f.year} onChange={(e) => set({ year: e.target.value })} placeholder="مثال: 2021" />
        </label>
        <label className="ad-field">
          <span>
            المحافظة
            <Req />
          </span>
          <select className="ad-in" value={f.governorate} onChange={(e) => set({ governorate: e.target.value })} required>
            {govs.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="ad-field">
        الملحقات اللي مع الجهاز
        <textarea className="ad-in" value={f.accessories} onChange={(e) => set({ accessories: e.target.value })} placeholder="مثال: شاحن، 2 هاند بيس، فوت كنترول" />
      </label>
    </section>
  );
}
