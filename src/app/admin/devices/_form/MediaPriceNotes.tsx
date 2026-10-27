"use client";

import { BUSINESS } from "@/config/business";
import { fmt, parseNum } from "@/lib/demo/labels";
import { DropButton, Req, SectionHead } from "./bits";
import type { FormState } from "./model";

export function MediaSection({
  photos,
  video,
  existingPhotos,
  onPhotos,
  onVideo,
}: {
  photos: number;
  video: string;
  existingPhotos: boolean;
  onPhotos: (n: number) => void;
  onVideo: (name: string) => void;
}) {
  const { min, max } = BUSINESS.photos;
  const photoStatus = photos
    ? `اتختار ${photos} ${photos > 2 && photos < 11 ? "صور" : "صورة"}${photos > max ? ` — الحد الأقصى ${max}` : ""}`
    : existingPhotos
      ? "صور الجهاز مرفوعة قبل كده"
      : undefined;
  return (
    <section className="ad-card" aria-labelledby="ad-s4">
      <SectionHead id="ad-s4" n="٤" bg="#EAF5DD" fg="#3F7A1F">
        الصور والفيديو
      </SectionHead>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        <DropButton
          accept="image/*"
          multiple
          iconBg="#3F7A1F"
          title="صور الجهاز"
          required
          hint={`من ${min} لـ ${max} صور · أول صورة هي الغلاف`}
          status={photoStatus}
          onFiles={(files) => onPhotos(Math.min(max, photos + files.length))}
          icon={
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.8" />
              <path d="M21 16l-5-5-8 8" />
            </svg>
          }
        />
        <DropButton
          accept="video/*"
          iconBg="#12221F"
          title="فيديو وهو شغال"
          hint={`من ${BUSINESS.videoSeconds.min} ثانية لدقيقة`}
          status={video ? `اتختار: ${video}` : undefined}
          onFiles={(files) => onVideo(files[0].name)}
          icon={
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          }
        />
      </div>
      {photos ? (
        <button type="button" className="ad-hint" onClick={() => onPhotos(0)} style={{ alignSelf: "flex-start", border: 0, background: "none", padding: 0, cursor: "pointer", textDecoration: "underline" }}>
          امسح الصور المختارة
        </button>
      ) : null}
    </section>
  );
}

export function PriceSection({ f, set }: { f: FormState; set: (patch: Partial<FormState>) => void }) {
  const price = parseNum(f.price);
  const cost = parseNum(f.purchaseCost);
  const showMargin = f.src === "company" && price > 0;
  return (
    <section className="ad-card" aria-labelledby="ad-s5">
      <SectionHead id="ad-s5" n="٥" bg="#E3F0ED" fg="#0D5C55">
        السعر والضمان
      </SectionHead>
      <div className="ad-grid">
        <label className="ad-field">
          <span>
            سعر البيع للمشتري (ج.م)
            <Req />
          </span>
          <input
            type="text"
            inputMode="numeric"
            className="ad-in"
            value={f.price}
            onChange={(e) => set({ price: e.target.value })}
            placeholder="مثال: 45000"
            required
          />
        </label>
        <label className="ad-field">
          مدة الصيانة المجانية
          <select className="ad-in" value={f.maint} onChange={(e) => set({ maint: Number(e.target.value) as FormState["maint"] })}>
            {BUSINESS.maintenanceMonthsOptions.map((m) => (
              <option key={m} value={m}>
                {m} شهور
              </option>
            ))}
          </select>
        </label>
      </div>
      {showMargin ? (
        <div style={{ padding: "12px 16px", borderRadius: 14, background: "#FBEEDC", color: "#6B3A10", fontSize: 14, display: "flex", justifyContent: "space-between", gap: 10 }}>
          <span>
            الربح المتوقع{" "}
            <span className="ad-int" style={{ background: "#FFFFFF" }}>
              داخلي
            </span>
          </span>
          <span style={{ fontWeight: 700 }}>
            {cost ? `${fmt(price - cost)} ج.م` : "سعر البيع − تكلفة الشراء"}
          </span>
        </div>
      ) : null}
      <div style={{ padding: "12px 16px", borderRadius: 14, background: "#F5F7F4", fontSize: 14, color: "#3C4C48" }}>
        ثابت على كل الأجهزة: استبدال أو استرجاع {BUSINESS.trialDays} أيام، وفلوس المشتري محفوظة لحد الاستلام.
      </div>
    </section>
  );
}

export function NotesSection({ f, set }: { f: FormState; set: (patch: Partial<FormState>) => void }) {
  return (
    <section className="ad-card" aria-labelledby="ad-s6" style={{ borderColor: "#F0C88A" }}>
      <h2 className="ad-h" id="ad-s6">
        <span className="ad-n" style={{ background: "#FBEEDC", color: "#8A4209" }}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        ملاحظات داخلية
      </h2>
      <label className="ad-field">
        <span>للفريق بس، مش بتظهر للمشتري</span>
        <textarea className="ad-in" value={f.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="مثال: سبب البيع، مصدر الجهاز، ملاحظات الفني" />
      </label>
    </section>
  );
}
