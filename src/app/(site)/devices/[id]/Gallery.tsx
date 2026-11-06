"use client";

import { useState } from "react";
import { VIDEO_ENABLED } from "@/config/features";
import type { BuiltinType, Device } from "@/lib/demo/types";
import { artKey } from "@/lib/demo/labels";
import { defectInfo, svgProps } from "./helpers";

type Slide = { ref: string; label: string; video?: boolean; defect?: boolean; src?: string };

/** Same type → art mapping as the cards in «كل الأجهزة» (symbols from ../art.tsx). */
const TYPE_ART: Record<BuiltinType, string> = {
  unit: "#br-unit", xray: "#br-xray", autoclave: "#br-autoclave", surg: "#br-surg", endo: "#br-rotary",
  apex: "#br-apex", cure: "#br-cure", rotary: "#br-rotary", contra: "#br-contra", micro: "#br-micro",
  iocam: "#br-iocam", cam: "#br-iocam", loupe: "#br-loupe", other: "#br-unit",
};

function slidesFor(d: Device): Slide[] {
  // Real photos (Supabase Storage) replace the drawings once a listing has any.
  if (d.photos?.length) return d.photos.map((src, k) => ({ ref: "", src, label: k === 0 ? `صورة ${d.title}` : `صورة ${k + 1} لـ${d.title}` }));
  const all = allSlidesFor(d);
  return VIDEO_ENABLED ? all : all.filter((s) => !s.video);
}

function allSlidesFor(d: Device): Slide[] {
  const { count } = defectInfo(d);
  if (d.inspection === "inspected") {
    if (d.type === "unit") {
      return [
        { ref: "#li-front", label: "صورة أمامية لليونيت" },
        { ref: "#li-recline", label: "الكرسي وهو مفرود" },
        { ref: "#li-tray", label: "ترابيزة الأدوات والخطوط" },
        ...(count ? [{ ref: "#li-defect", label: "صورة العيب", defect: true }] : []),
        { ref: "#li-light", label: "فيديو وهو شغال", video: true },
      ];
    }
    const art = TYPE_ART[artKey(d.type)];
    return [
      { ref: art, label: `صورة ${d.title}` },
      ...(count ? [{ ref: art, label: "صورة العيب", defect: true }] : []),
      { ref: art, label: "فيديو وهو شغال", video: true },
    ];
  }
  if (d.type === "autoclave") {
    return [
      { ref: "#oo-front", label: "صورة أمامية" },
      { ref: "#oo-open", label: "الباب مفتوح" },
      { ref: "#oo-panel", label: "لوحة التحكم" },
      { ref: "#oo-side", label: "فيديو الجهاز", video: true },
    ];
  }
  const art = TYPE_ART[artKey(d.type)];
  return [
    { ref: art, label: `صورة ${d.title}` },
    { ref: art, label: "فيديو الجهاز", video: true },
  ];
}

const pic = { display: "block", width: "100%", height: "100%" } as const;

function Pic({ s, thumb }: { s: Slide; thumb?: boolean }) {
  if (s.src) {
    // eslint-disable-next-line @next/next/no-img-element -- Storage URLs, already resized on upload
    return <img src={s.src} alt={thumb ? "" : s.label} style={{ ...pic, objectFit: "cover" }} />;
  }
  return thumb ? (
    <svg aria-hidden="true" viewBox="0 0 400 300" style={pic}><use href={s.ref} /></svg>
  ) : (
    <svg role="img" aria-label={s.label} viewBox="0 0 400 300" style={pic}><use href={s.ref} /></svg>
  );
}

export function Gallery({ d }: { d: Device }) {
  const [i, setI] = useState(0);
  const slides = slidesFor(d);
  const s = slides[Math.min(i, slides.length - 1)];
  const inspected = d.inspection === "inspected";
  const caption = defectInfo(d).caption;
  const cols = d.photos?.length ? Math.min(5, Math.max(4, slides.length)) : inspected ? 5 : 4;

  return (
    <>
      <div className="hm-ph li-gal-main">
        {s.video ? (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <svg role="img" aria-label={inspected ? "فيديو وهو شغال" : "فيديو الجهاز وهو شغال"} viewBox="0 0 400 300" style={pic}><use href={s.ref} /></svg>
            <div className="li-vid">
              <span className="li-vid-play">
                <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span>{inspected ? "فيديو وهو شغال" : "فيديو الجهاز وهو شغال · 0:42"}</span>
            </div>
          </div>
        ) : (
          <Pic s={s} />
        )}

        <span className={inspected ? "li-badge li-badge-ok" : "li-badge li-badge-ord"}>
          {inspected ? (
            <><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...svgProps} strokeWidth={2.4}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>تم الفحص</>
          ) : (
            <><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...svgProps} strokeWidth={2}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>يُفحص عند الطلب</>
          )}
        </span>
        <span className="li-count hm-num">{slides.indexOf(s) + 1} / {slides.length}</span>

        {!inspected ? (
          <span className="li-cap">
            {VIDEO_ENABLED ? "الصور والفيديو من البايع." : "الصور من البايع."} فريقنا هيصوّر الجهاز ويفحصه بعد طلبك.
          </span>
        ) : s.defect ? (
          <span className="li-cap li-cap-warn">
            <span aria-hidden="true" className="li-cap-bang">!</span>
            {caption}
          </span>
        ) : !s.video ? (
          <span className="li-cap">صورة حقيقية للجهاز — تصوير فريق الفحص</span>
        ) : null}
      </div>

      <div className="li-thumbs" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {slides.map((t, k) => {
          const on = t === s;
          return (
            <button
              key={k}
              type="button"
              className={t.defect ? "li-thumb is-defect" : "li-thumb"}
              onClick={() => setI(k)}
              aria-label={t.label}
              aria-pressed={on}
            >
              <Pic s={t} thumb />
              {t.video ? (
                <span className="li-thumb-vid">
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  {inspected ? <span>فيديو وهو شغال</span> : null}
                </span>
              ) : null}
              {t.defect ? <span className="li-thumb-defect">صورة العيب</span> : null}
            </button>
          );
        })}
      </div>
    </>
  );
}
