"use client";

// «احفظ» heart (favorites, PHASE1_PROMPT.md §6 — client asked for it, Nov 2026).
// Signed-out visitors are sent to /login and come back to the same page.
import { useDemo } from "@/lib/demo/store";

const Heart = ({ on, size }: { on: boolean; size: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20s-7-4.4-9.2-8.8C1.3 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.3 3.7 3.8 6.7C19 15.6 12 20 12 20z" />
  </svg>
);

/** Round heart over a card picture. */
export function SaveHeart({ deviceId, title }: { deviceId: string; title: string }) {
  const { state, toggleFavorite } = useDemo();
  const on = state.favorites.includes(deviceId);
  return (
    <button
      type="button"
      className={on ? "save-heart is-on" : "save-heart"}
      aria-pressed={on}
      aria-label={on ? `شيل ${title} من المحفوظات` : `احفظ ${title}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(deviceId);
      }}
    >
      <Heart on={on} size={20} />
    </button>
  );
}

/** Full-width «احفظ الجهاز» button for the device page. */
export function SaveButton({ deviceId }: { deviceId: string }) {
  const { state, toggleFavorite } = useDemo();
  const on = state.favorites.includes(deviceId);
  return (
    <button type="button" className={on ? "save-btn is-on" : "save-btn"} aria-pressed={on} onClick={() => toggleFavorite(deviceId)}>
      <Heart on={on} size={20} />
      {on ? "محفوظ في حسابك" : "احفظ الجهاز"}
    </button>
  );
}
