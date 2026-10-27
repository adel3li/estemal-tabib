"use client";

import { useRef, useState, type ReactNode } from "react";
import { BUSINESS } from "@/config/business";
import { fieldId, type Errors, type Media, type VideoPick } from "./form";
import { CardHead, grid, Msg, Star } from "./ui";

/** Reads a video's duration in seconds with a detached <video> element. */
function videoSeconds(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(v.duration);
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    v.src = url;
  });
}

const UpArrow = (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5" />
    <path d="M6 11l6-6 6 6" />
  </svg>
);
const Plus = (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

function Tile({
  id,
  art,
  title,
  required,
  hint,
  cta,
  ctaIcon,
  muted,
  accept,
  multiple,
  onFiles,
  files,
  onRemove,
  invalid,
  status,
}: {
  id?: string;
  art: string;
  title: string;
  required?: boolean;
  hint: string;
  cta: string;
  ctaIcon: ReactNode;
  muted?: boolean;
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  files: { name: string; note?: string }[];
  onRemove: (i: number) => void;
  invalid: boolean;
  status?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const cls = ["sl-drop", files.length ? "sl-drop-on" : "", invalid ? "sl-bad-box" : ""].filter(Boolean).join(" ");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        data-tile={art}
        onChange={(e) => {
          const list = Array.from(e.target.files ?? []);
          e.target.value = ""; // allow picking the same file again
          if (list.length) onFiles(list);
        }}
      />
      <button type="button" id={id} className={cls} style={muted && !files.length && !invalid ? { borderColor: "#C9D4CF" } : undefined} onClick={() => input.current?.click()} aria-describedby={invalid && id ? `${id}-msg` : undefined}>
        <svg aria-hidden="true" viewBox="0 0 200 120" style={{ display: "block", width: "100%", maxWidth: 220, height: "auto", marginBottom: 6 }}>
          <use href={`#${art}`} />
        </svg>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#12221F" }}>
          {title}
          {required ? <Star /> : null}
        </span>
        <span style={{ fontSize: 13 }}>{status ?? hint}</span>
        <span style={{ marginTop: 4, padding: "6px 14px", borderRadius: 999, background: muted ? "#F5F7F4" : "#E3F0ED", color: muted ? "#3C4C48" : "#0D5C55", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          {ctaIcon}
          {cta}
        </span>
      </button>
      {files.length ? (
        <ul className="sl-files" aria-label={`${title}: الملفات اللي اخترتها`}>
          {files.map((x, i) => (
            <li key={`${x.name}-${i}`}>
              <span dir="auto">{x.name}</span>
              {x.note ? <span style={{ flex: "none", color: "#4A5A56" }}>{x.note}</span> : null}
              <button type="button" className="sl-x" aria-label={`شيل ${x.name}`} onClick={() => onRemove(i)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function SectionMedia({ media, setMedia, err }: { media: Media; setMedia: (m: Media) => void; err: Errors }) {
  const [videoMsg, setVideoMsg] = useState("");
  const [photoMsg, setPhotoMsg] = useState("");
  const { min, max } = BUSINESS.photos;
  const vs = BUSINESS.videoSeconds;

  const addPhotos = (list: File[]) => {
    const imgs = list.filter((f) => f.type.startsWith("image/"));
    const all = [...media.photos, ...imgs];
    setPhotoMsg(all.length > max ? `أقصى عدد ${max} صور، خدنا أول ${max} بس.` : "");
    setMedia({ ...media, photos: all.slice(0, max) });
  };

  const pickVideo = async (list: File[]) => {
    const file = list[0];
    if (!file.type.startsWith("video/")) {
      setVideoMsg("ده مش ملف فيديو.");
      return;
    }
    try {
      const seconds = await videoSeconds(file);
      if (!Number.isFinite(seconds) || seconds < vs.min || seconds > vs.max) {
        setVideoMsg(`الفيديو ${Math.round(seconds)} ثانية، ولازم يكون من ${vs.min} ثانية لـ ${vs.max} ثانية.`);
        return;
      }
      setVideoMsg("");
      const pick: VideoPick = { file, seconds };
      setMedia({ ...media, video: pick });
    } catch {
      setVideoMsg("مقدرناش نقرا الفيديو ده. جرّب ملف MP4 تاني.");
    }
  };

  const photoStatus = media.photos.length ? `اخترت ${media.photos.length} من ${max} صور` : undefined;
  const vid = media.video;

  return (
    <fieldset id="sl-s4" className="sl-card">
      <CardHead
        iconBg="#EAF5DD"
        iconFg="#3F7A1F"
        step="الخطوة ٤ من ٦"
        stepFg="#3F7A1F"
        title="٤. الصور والفيديو"
        icon={
          <>
            <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
            <circle cx="12" cy="13" r="3.5" />
          </>
        }
      />
      <div className="sl-body">
        <div style={grid(220, 14)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
            <Tile
              id={fieldId("photos")}
              art="sl-up-photo"
              title="صور الجهاز من كل الزوايا"
              required
              hint={`من ${min} لـ ${max} صور حديثة وواضحة`}
              status={photoStatus}
              cta={media.photos.length ? "ضيف صور" : "اختار الصور"}
              ctaIcon={UpArrow}
              accept="image/*"
              multiple
              onFiles={addPhotos}
              files={media.photos.map((p) => ({ name: p.name }))}
              onRemove={(i) => setMedia({ ...media, photos: media.photos.filter((_, j) => j !== i) })}
              invalid={!!err.photos}
            />
            {photoMsg ? <span className="sl-msg" style={{ color: "#8A4209" }}>{photoMsg}</span> : null}
            <Msg k="photos" err={err} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
            <Tile
              id={fieldId("video")}
              art="sl-up-video"
              title="فيديو الجهاز وهو شغال"
              required
              hint={`من ${vs.min} ثانية لدقيقة`}
              status={vid ? `فيديو ${Math.round(vid.seconds)} ثانية ✓` : undefined}
              cta={vid ? "غيّر الفيديو" : "اختار الفيديو"}
              ctaIcon={UpArrow}
              accept="video/*"
              onFiles={pickVideo}
              files={vid ? [{ name: vid.file.name, note: `${Math.round(vid.seconds)} ث` }] : []}
              onRemove={() => setMedia({ ...media, video: null })}
              invalid={!!err.video || !!videoMsg}
            />
            {videoMsg ? (
              <span className="sl-msg" role="alert">
                {videoMsg}
              </span>
            ) : (
              <Msg k="video" err={err} />
            )}
          </div>
          <Tile
            art="sl-up-extra"
            title="صور الملحقات والعيوب"
            hint="لو موجودة"
            status={media.extras.length ? `اخترت ${media.extras.length} صور` : undefined}
            cta="إضافة"
            ctaIcon={Plus}
            muted
            accept="image/*"
            multiple
            onFiles={(list) => setMedia({ ...media, extras: [...media.extras, ...list.filter((f) => f.type.startsWith("image/"))] })}
            files={media.extras.map((p) => ({ name: p.name }))}
            onRemove={(i) => setMedia({ ...media, extras: media.extras.filter((_, j) => j !== i) })}
            invalid={false}
          />
        </div>
      </div>
    </fieldset>
  );
}
