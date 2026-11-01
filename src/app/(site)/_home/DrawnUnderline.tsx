"use client";

// Orange underline under «بثقة» that draws itself like a pen stroke when the
// page opens and again every time the tagline comes back into view (client
// request, Nov 2026). The first draw is pure CSS (works before/without JS);
// re-entering the viewport remounts the path, which replays the animation.
// Reduced motion: the line is just shown.
import { useEffect, useRef, useState } from "react";

export function DrawnUnderline() {
  const ref = useRef<SVGSVGElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let away = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) away = true;
        else if (away) {
          away = false;
          setRun((n) => n + 1);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      className="mn-pen"
      style={{ position: "absolute", right: 0, left: 0, bottom: -6, width: "100%", height: 12, overflow: "visible" }}
    >
      {/* Path runs right → left so the stroke starts at the beginning of the RTL word. */}
      <path key={run} d="M117 7 Q60 1 3 8" pathLength={1} stroke="#F2A33A" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
