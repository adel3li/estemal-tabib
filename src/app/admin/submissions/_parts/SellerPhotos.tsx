"use client";

// The seller's real photos (private bucket → short-lived links). Click opens
// the full photo in a new tab.
import { useEffect, useState } from "react";
import { VIDEO_ENABLED } from "@/config/features";
import type { Submission } from "@/lib/demo/types";
import { fetchSubmissionPhotos, type MediaItem } from "@/lib/media/photos";
import { supabaseBrowser } from "@/lib/supabase/client";
import { THUMB_TF } from "./meta";

const box: React.CSSProperties = { position: "relative", aspectRatio: "4 / 3", borderRadius: 12, overflow: "hidden", border: "1px solid #DCE3DF", display: "block", background: "#F5F7F4" };
const num: React.CSSProperties = { position: "absolute", bottom: 4, right: 4, padding: "0 6px", borderRadius: 6, background: "rgba(18, 34, 31, 0.7)", color: "#FFFFFF" };

export function SellerPhotos({ p, img }: { p: Submission; img: string }) {
  const [items, setItems] = useState<{ for: string; list: MediaItem[] } | null>(null);
  const dbId = p.dbId;

  useEffect(() => {
    if (!dbId || !p.photos) return;
    let alive = true;
    void fetchSubmissionPhotos(supabaseBrowser(), dbId).then((list) => {
      if (alive) setItems({ for: dbId, list });
    });
    return () => {
      alive = false;
    };
  }, [dbId, p.photos]);

  const list = items && items.for === dbId ? items.list : null;

  return (
    <div className="sb-photos">
      {list
        ? list.map((m, i) => (
            <a key={m.id} href={m.url} target="_blank" rel="noreferrer" style={box} aria-label={`صورة ${i + 1} من ${list.length}${m.kind === "accessory" ? " (ملحقات)" : ""} — افتح الصورة كاملة`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- signed Storage URL */}
              <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <span style={num} className="sb-num">{i + 1}</span>
              {m.kind === "accessory" ? <span style={{ ...num, right: "auto", left: 4, background: "#8A4209" }} className="sb-num">ملحقات</span> : null}
            </a>
          ))
        : dbId
          ? Array.from({ length: p.photos }, (_, i) => <span key={i} style={box} aria-label="بنحمّل الصورة…" />)
          : Array.from({ length: p.photos }, (_, i) => (
              <span key={i} style={box}>
                <svg role="img" aria-label={`صورة ${i + 1} من ${p.photos} — ${p.details}`} viewBox="0 0 120 90" style={{ display: "block", width: "100%", height: "100%", transform: THUMB_TF[i % THUMB_TF.length] }}>
                  <use href={img} />
                </svg>
                <span style={num} className="sb-num">{i + 1}</span>
              </span>
            ))}
      {VIDEO_ENABLED && p.hasVideo ? (
        <span role="img" aria-label="فيديو الجهاز وهو شغال" style={{ aspectRatio: "4 / 3", borderRadius: 12, background: "#12221F", color: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, fontSize: 12 }}>
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          فيديو وهو شغال
        </span>
      ) : null}
    </div>
  );
}
