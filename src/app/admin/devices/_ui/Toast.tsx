import type { ReactNode } from "react";
import "./toast.css";

export type ToastTone = "ok" | "bad";

/** Inline confirmation banner used after admin actions (Admin-*.dc.html). */
export function Toast({
  children,
  tone = "ok",
  onClose,
  closeClass = "al-act",
  floating = false,
}: {
  children: ReactNode;
  tone?: ToastTone;
  onClose: () => void;
  closeClass?: string;
  /** On < 1024px, stick under the admin top bar so the message is seen wherever the user tapped. */
  floating?: boolean;
}) {
  const bad = tone === "bad";
  const fg = bad ? "#B3261E" : "#0D5C55";
  return (
    <div
      role="status"
      aria-live="polite"
      className={floating ? "tst tst-float" : "tst"}
      style={{
        padding: "12px 16px",
        borderRadius: 14,
        background: bad ? "#FBE9E7" : "#E3F0ED",
        border: `1px solid ${bad ? "#E9B3AE" : "#9CCBC2"}`,
        color: bad ? "#B3261E" : "#0B4A44",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 999,
          background: fg,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "none",
        }}
      >
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l4 4 10-10" />
        </svg>
      </span>
      <span style={{ flex: 1 }}>{children}</span>
      <button
        type="button"
        className={`${closeClass} tst-x`}
        onClick={onClose}
        aria-label="اقفل الرسالة"
      >
        ✕
      </button>
    </div>
  );
}
