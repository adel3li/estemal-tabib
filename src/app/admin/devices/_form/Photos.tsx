"use client";

// Listing photos (Supabase Storage, bucket device-photos). An existing listing
// uploads right away; a new one keeps the picked files until it's saved, then
// DeviceForm uploads them. The first photo is the cover.
import { useEffect, useMemo, useState } from "react";
import { BUSINESS } from "@/config/business";
import { deleteDevicePhoto, fetchDevicePhotos, reorderDevicePhotos, uploadDevicePhotos, type MediaItem } from "@/lib/media/photos";
import { supabaseBrowser } from "@/lib/supabase/client";
import { DropButton, SectionHead } from "./bits";

type Props = {
  dbId?: string;
  pending: File[];
  setPending: (f: File[]) => void;
  /** Saved + pending photos, for the «ready to publish» check. */
  onCount: (n: number) => void;
  /** Photos changed on the server → the store reloads the listing. */
  onChanged: () => void;
};

const thumb: React.CSSProperties = { position: "relative", aspectRatio: "4 / 3", borderRadius: 12, overflow: "hidden", border: "1px solid #DCE3DF", background: "#F5F7F4" };

export function PhotosSection({ dbId, pending, setPending, onCount, onChanged }: Props) {
  const { min, max } = BUSINESS.photos;
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState("");
  const previews = useMemo(() => pending.map((f) => URL.createObjectURL(f)), [pending]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  useEffect(() => {
    if (!dbId) return;
    let alive = true;
    void fetchDevicePhotos(supabaseBrowser(), dbId).then((x) => {
      if (alive) setItems(x);
    });
    return () => {
      alive = false;
    };
  }, [dbId]);

  const total = items.length + pending.length;
  useEffect(() => onCount(total), [total, onCount]);

  const add = async (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/")).slice(0, Math.max(0, max - total));
    if (!imgs.length) return;
    if (!dbId) {
      setPending([...pending, ...imgs]);
      return;
    }
    const sb = supabaseBrowser();
    await uploadDevicePhotos(sb, dbId, imgs, items.length, (d, t) => setBusy(`بنرفع الصور… ${d} من ${t}`));
    setItems(await fetchDevicePhotos(sb, dbId));
    setBusy("");
    onChanged();
  };

  const remove = async (it: MediaItem) => {
    if (!window.confirm("تمسح الصورة دي؟")) return;
    const sb = supabaseBrowser();
    await deleteDevicePhoto(sb, it);
    const rest = items.filter((x) => x.id !== it.id);
    await reorderDevicePhotos(sb, rest);
    setItems(rest);
    onChanged();
  };

  const cover = async (i: number) => {
    const next = [items[i], ...items.filter((_, j) => j !== i)];
    setItems(next);
    await reorderDevicePhotos(supabaseBrowser(), next);
    onChanged();
  };

  return (
    <section className="ad-card" aria-labelledby="ad-s4">
      <SectionHead id="ad-s4" n="٤" bg="#EAF5DD" fg="#3F7A1F">
        الصور
      </SectionHead>
      <DropButton
        accept="image/*"
        multiple
        iconBg="#3F7A1F"
        title="ضيف صور الجهاز"
        required
        hint={`من ${min} لـ ${max} صور · أول صورة هي الغلاف · بتتصغّر لوحدها قبل الرفع`}
        status={busy || (total ? `${total} من ${max} صور${!dbId && pending.length ? " — هتترفع لما تحفظ الجهاز" : ""}` : undefined)}
        onFiles={(files) => void add(files)}
        icon={
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.8" />
            <path d="M21 16l-5-5-8 8" />
          </svg>
        }
      />
      {total ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
          {items.map((it, i) => (
            <div key={it.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={thumb}>
                {/* eslint-disable-next-line @next/next/no-img-element -- Storage URLs, already resized */}
                <img src={it.url} alt={`صورة ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {i === 0 ? <span style={{ position: "absolute", top: 6, right: 6, padding: "1px 8px", borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontSize: 12, fontWeight: 700 }}>الغلاف</span> : null}
              </span>
              <span style={{ display: "flex", gap: 6 }}>
                {i > 0 ? <button type="button" className="ad-btn ad-sec" style={{ flex: 1, minHeight: 36, padding: "0 6px", fontSize: 13 }} onClick={() => void cover(i)}>خليها الغلاف</button> : null}
                <button type="button" className="ad-btn ad-sec" style={{ flex: 1, minHeight: 36, padding: "0 6px", fontSize: 13, color: "#B3261E" }} onClick={() => void remove(it)} aria-label={`امسح صورة ${i + 1}`}>امسح</button>
              </span>
            </div>
          ))}
          {pending.map((f, i) => (
            <div key={`p${i}`} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={thumb}>
                {/* eslint-disable-next-line @next/next/no-img-element -- local preview */}
                <img src={previews[i]} alt={`صورة جديدة ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.85 }} />
                {items.length === 0 && i === 0 ? <span style={{ position: "absolute", top: 6, right: 6, padding: "1px 8px", borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontSize: 12, fontWeight: 700 }}>الغلاف</span> : null}
              </span>
              <button type="button" className="ad-btn ad-sec" style={{ minHeight: 36, fontSize: 13, color: "#B3261E" }} onClick={() => setPending(pending.filter((_, j) => j !== i))} aria-label={`شيل صورة جديدة ${i + 1}`}>شيل</button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
