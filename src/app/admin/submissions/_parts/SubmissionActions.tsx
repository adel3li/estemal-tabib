"use client";

import { useState } from "react";
import type { Submission } from "@/lib/demo/types";
import { PHOTO_REQS, REJECT_REASONS, SLOTS, TECHS } from "./meta";

type Mode = "" | "photos" | "sched" | "reject";

export type ActionHandlers = {
  accept: () => void;
  requestPhotos: (what: string) => void;
  schedule: (date: string, slot: string, tech: string) => void;
  reject: (reason: string, note: string) => void;
};

function Chip({ on, label, onClick, col = "#0D5C55" }: { on: boolean; label: string; onClick: () => void; col?: string }) {
  return (
    <button
      type="button"
      className="ad-chip"
      onClick={onClick}
      aria-pressed={on}
      style={{ border: `1px solid ${on ? col : "#C9D4CF"}`, background: on ? col : "#FFFFFF", color: on ? "#FFFFFF" : "#12221F" }}
    >
      {label}
    </button>
  );
}

/** The «قبول / اطلب صور / حدد ميعاد / رفض» block with its sub-flows (Admin-Submissions.dc.html script). */
export function SubmissionActions({ p, h }: { p: Submission; h: ActionHandlers }) {
  const [mode, setMode] = useState<Mode>("");
  const [photoReq, setPhotoReq] = useState<string[]>(["plate"]);
  const [schedDate, setSchedDate] = useState("");
  const [schedSlot, setSchedSlot] = useState(SLOTS[0]);
  const [tech, setTech] = useState(TECHS[0]);
  const [rej, setRej] = useState("");
  const [rejNote, setRejNote] = useState("");
  const [rejTried, setRejTried] = useState(false);
  const cancel = () => {
    setMode("");
    setRejTried(false);
  };

  return (
    <div style={{ paddingTop: 16, borderTop: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 14 }}>
      {!mode ? (
        <div className="sb-mainacts">
          <button type="button" className="sb-act sb-ok" onClick={h.accept}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l4 4 10-10" />
            </svg>
            قبول وتحويل لإعلان
          </button>
          <button type="button" className="sb-act" onClick={() => setMode("photos")}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.8" />
              <path d="M21 16l-5-5-8 8" />
            </svg>
            اطلب صور تانية
          </button>
          <button type="button" className="sb-act" onClick={() => setMode("sched")}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="5" width="16" height="15" rx="2" />
              <path d="M4 10h16M9 3v4M15 3v4" />
            </svg>
            حدد ميعاد فحص
          </button>
          <button
            type="button"
            className="sb-act sb-no"
            onClick={() => {
              setMode("reject");
              setRejTried(false);
            }}
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            رفض
          </button>
        </div>
      ) : null}

      {mode === "photos" ? (
        <div style={{ padding: 16, borderRadius: 16, background: "#F5F7F4", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 700 }}>محتاجين إيه من البايع؟</div>
          <div className="sb-chips" role="group" aria-label="محتاجين إيه من البايع؟">
            {PHOTO_REQS.map(([k, label]) => {
              const on = photoReq.includes(k);
              return <Chip key={k} on={on} label={label} onClick={() => setPhotoReq(on ? photoReq.filter((x) => x !== k) : [...photoReq, k])} />;
            })}
          </div>
          <div className="sb-subacts">
            <button
              type="button"
              className="sb-act sb-ok"
              onClick={() => {
                const names = PHOTO_REQS.filter(([k]) => photoReq.includes(k)).map(([, l]) => l);
                h.requestPhotos(names.length ? names.join("، ") : "صور إضافية");
                setMode("");
              }}
            >
              ابعت الطلب للبايع
            </button>
            <button type="button" className="sb-act" onClick={cancel}>
              إلغاء
            </button>
          </div>
        </div>
      ) : null}

      {mode === "sched" ? (
        <div style={{ padding: 16, borderRadius: 16, background: "#E3F0ED", border: "1px solid #9CCBC2", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 700 }}>ميعاد الفحص مع فني معتمد</div>
          <div style={{ fontSize: 14, color: "#0B4A44" }}>
            {p.keepLocation === "with_seller"
              ? `البايع اختار «يفضل معايا»: الفني المعتمد هيروح يعاين الجهاز عنده في ${p.governorate}.`
              : "البايع اختار «أبعته يتفحص»: البايع هيبعت الجهاز لمقر الفحص في الميعاد ده."}
          </div>
          <div className="ad-grid">
            <label className="ad-field">
              اليوم
              <input type="date" className="ad-in" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} />
            </label>
            <label className="ad-field">
              الوقت
              <select className="ad-in" value={schedSlot} onChange={(e) => setSchedSlot(e.target.value)}>
                {SLOTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="ad-field">
              الفني المعتمد
              <select className="ad-in" value={tech} onChange={(e) => setTech(e.target.value)}>
                {TECHS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="sb-subacts">
            <button
              type="button"
              className="sb-act sb-ok"
              onClick={() => {
                h.schedule(schedDate || "[التاريخ]", schedSlot, tech);
                setMode("");
              }}
            >
              أكّد الميعاد وابعته للبايع
            </button>
            <button type="button" className="sb-act" onClick={cancel}>
              إلغاء
            </button>
          </div>
        </div>
      ) : null}

      {mode === "reject" ? (
        <div style={{ padding: 16, borderRadius: 16, background: "#FBE9E7", border: "1px solid #E9B3AE", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 700, color: "#7A1A14" }}>
            سبب الرفض
            <span aria-hidden="true" style={{ color: "#B3261E", marginRight: 4 }}>
              *
            </span>
          </div>
          <div className="sb-chips" role="group" aria-label="سبب الرفض">
            {REJECT_REASONS.map((r) => (
              <Chip key={r} on={rej === r} label={r} onClick={() => setRej(r)} col="#B3261E" />
            ))}
          </div>
          <label className="ad-field">
            رسالة للبايع (اختياري)
            <textarea className="ad-in" enterKeyHint="done" value={rejNote} onChange={(e) => setRejNote(e.target.value)} placeholder="مثال: ممكن تعيد عرض الجهاز بسعر أقرب للسوق" />
          </label>
          {rejTried && !rej ? (
            <div role="alert" style={{ fontSize: 13, color: "#B3261E", fontWeight: 600 }}>
              اختار سبب الرفض الأول.
            </div>
          ) : null}
          <div className="sb-subacts">
            <button
              type="button"
              className="sb-act sb-danger"
              onClick={() => {
                if (!rej) {
                  setRejTried(true);
                  return;
                }
                h.reject(rej, rejNote.trim());
                setMode("");
                setRej("");
                setRejNote("");
                setRejTried(false);
              }}
            >
              أكّد الرفض
            </button>
            <button type="button" className="sb-act" onClick={cancel}>
              إلغاء
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
