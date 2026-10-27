import { ImageResponse } from "next/og";

// iOS home-screen icon (PNG, 180×180).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D5C55" }}>
        <svg width="112" height="112" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7 .5 3 1 6.5 2.5 6.5S9 18 10 15.5c.5-1.2 1.5-1.2 2 0 1 2.5 1.5 5.5 3 5.5s2-3.5 2.5-6.5c.5-2.5 2-4 2-7C19.5 5 18 3 15.5 3 13.5 3 13 4 12 4S10 3 7 3z" />
        </svg>
      </div>
    ),
    size,
  );
}
