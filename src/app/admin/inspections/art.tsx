import type { DeviceType } from "@/lib/demo/types";

export type InSym = "in-unit" | "in-box" | "in-xray" | "in-small" | "in-cam";

export function symFor(t: DeviceType): InSym {
  if (t === "unit") return "in-unit";
  if (t === "autoclave") return "in-box";
  if (t === "xray") return "in-xray";
  if (t === "iocam" || t === "cam") return "in-cam";
  return "in-small";
}

export function InSymbol({ sym, size }: { sym: InSym; size: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 64 64" style={{ flex: "none" }}>
      <use href={`#${sym}`} />
    </svg>
  );
}

/** Hidden sprite of device illustrations (from Admin-Inspections.dc.html). */
export function InSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <symbol id="in-unit" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#E3F0ED" /><path d="M18 44h22l6-10h-9l-3-14h-8l3 16h-8z" fill="#0D5C55" /><rect x="16" y="46" width="34" height="5" rx="2.5" fill="#12221F" opacity=".7" /><circle cx="44" cy="18" r="5" fill="#F2A33A" /><path d="M44 23v8" stroke="#4A5A56" strokeWidth="2" /></symbol>
      <symbol id="in-box" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#E6EDF7" /><rect x="12" y="16" width="40" height="32" rx="6" fill="#FFFFFF" stroke="#8FA09A" strokeWidth="2" /><circle cx="28" cy="33" r="10" fill="#B9C6C1" stroke="#5D7A74" strokeWidth="2" /><circle cx="28" cy="33" r="6" fill="#1D3330" /><rect x="42" y="22" width="5" height="18" rx="2.5" fill="#24508F" /></symbol>
      <symbol id="in-xray" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#FBEEDC" /><rect x="30" y="10" width="5" height="44" rx="2.5" fill="#4A5A56" /><path d="M33 18h16v8H33z" fill="#FFFFFF" stroke="#8A4209" strokeWidth="2" /><circle cx="49" cy="22" r="5" fill="#F2A33A" /><rect x="22" y="50" width="22" height="5" rx="2.5" fill="#12221F" opacity=".7" /></symbol>
      <symbol id="in-small" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#EAF5DD" /><rect x="14" y="26" width="26" height="22" rx="5" fill="#FFFFFF" stroke="#3F7A1F" strokeWidth="2" /><rect x="18" y="30" width="18" height="7" rx="2" fill="#12221F" /><path d="M40 34c8 0 8-14 14-18" stroke="#4A5A56" strokeWidth="2.5" fill="none" strokeLinecap="round" /><rect x="50" y="10" width="6" height="12" rx="3" transform="rotate(30 53 16)" fill="#3F7A1F" /></symbol>
      <symbol id="in-cam" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#F5F7F4" /><rect x="10" y="28" width="40" height="9" rx="4.5" fill="#FFFFFF" stroke="#4A5A56" strokeWidth="2" /><circle cx="47" cy="32.5" r="3" fill="#24508F" /><path d="M10 32.5c-3 0-4 6-2 10" stroke="#4A5A56" strokeWidth="2" fill="none" /></symbol>
    </svg>
  );
}
