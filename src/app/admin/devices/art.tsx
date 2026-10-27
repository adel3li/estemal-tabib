// Illustrations from Admin-Listings.dc.html (al-*) and Admin.dc.html (ad-*).
import type { DeviceType } from "@/lib/demo/types";

/** Device type → listing art symbol id (Admin-Listings uses six drawings). */
export function artFor(type: DeviceType): string {
  switch (type) {
    case "unit":
      return "#al-unit";
    case "autoclave":
      return "#al-clave";
    case "xray":
      return "#al-xray";
    case "cure":
      return "#al-cure";
    case "iocam":
    case "cam":
      return "#al-cam";
    default:
      return "#al-motor";
  }
}

export function ListingArtDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <symbol id="al-unit" viewBox="0 0 120 90">
        <rect width="120" height="90" fill="#EEF4F1" />
        <ellipse cx="60" cy="80" rx="40" ry="4" fill="#12221F" opacity=".1" />
        <path d="M34 50V22h20" stroke="#8FA09A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="58" cy="22" rx="9" ry="4.5" fill="#F2A33A" />
        <rect x="56" y="56" width="8" height="16" fill="#8FA09A" />
        <rect x="42" y="71" width="36" height="7" rx="3" fill="#5D6E69" />
        <rect x="28" y="48" width="54" height="10" rx="5" fill="#0D5C55" />
        <rect x="76" y="22" width="10" height="32" rx="5" fill="#0D5C55" transform="rotate(16 81 38)" />
        <rect x="83" y="14" width="10" height="8" rx="3" fill="#12221F" transform="rotate(16 88 18)" />
      </symbol>
      <symbol id="al-clave" viewBox="0 0 120 90">
        <rect width="120" height="90" fill="#EEF4F1" />
        <ellipse cx="60" cy="80" rx="40" ry="4" fill="#12221F" opacity=".1" />
        <rect x="24" y="20" width="72" height="56" rx="9" fill="#FFFFFF" stroke="#AEBDB7" strokeWidth="1.5" />
        <circle cx="52" cy="50" r="18" fill="#B9C6C1" stroke="#8FA09A" />
        <circle cx="52" cy="50" r="12" fill="#1D3330" />
        <rect x="76" y="28" width="14" height="8" rx="2" fill="#12221F" />
        <circle cx="83" cy="52" r="3" fill="#0D5C55" />
        <circle cx="83" cy="62" r="3" fill="#F2A33A" />
      </symbol>
      <symbol id="al-xray" viewBox="0 0 120 90">
        <rect width="120" height="90" fill="#EEF4F1" />
        <rect x="18" y="12" width="10" height="44" rx="3" fill="#8FA09A" />
        <path d="M28 24L62 32L80 46" stroke="#AEBDB7" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="62" cy="32" r="4" fill="#5D6E69" />
        <rect x="72" y="42" width="24" height="18" rx="5" fill="#FFFFFF" stroke="#AEBDB7" strokeWidth="1.5" />
        <path d="M79 60h10l-2 16h-6z" fill="#F2A33A" />
        <circle cx="84" cy="51" r="3" fill="#0D5C55" />
      </symbol>
      <symbol id="al-motor" viewBox="0 0 120 90">
        <rect width="120" height="90" fill="#EEF4F1" />
        <ellipse cx="54" cy="78" rx="36" ry="4" fill="#12221F" opacity=".1" />
        <rect x="20" y="36" width="56" height="38" rx="7" fill="#FFFFFF" stroke="#AEBDB7" strokeWidth="1.5" />
        <rect x="28" y="43" width="26" height="15" rx="2" fill="#1D3330" />
        <path d="M32 52h6l3-5 3 8 3-3h4" stroke="#5FC4B6" strokeWidth="1.5" fill="none" />
        <circle cx="64" cy="48" r="3.5" fill="#0D5C55" />
        <circle cx="64" cy="60" r="3.5" fill="#F2A33A" />
        <path d="M76 56c14 0 14-26 22-30" stroke="#8FA09A" strokeWidth="2.5" fill="none" />
        <rect x="95" y="10" width="7" height="24" rx="3.5" fill="#B9C6C1" stroke="#8FA09A" transform="rotate(14 98 22)" />
      </symbol>
      <symbol id="al-cure" viewBox="0 0 120 90">
        <rect width="120" height="90" fill="#EEF4F1" />
        <rect x="30" y="64" width="44" height="9" rx="4" fill="#5D6E69" />
        <rect x="20" y="40" width="70" height="15" rx="7.5" fill="#FFFFFF" stroke="#AEBDB7" strokeWidth="1.5" />
        <path d="M88 46L104 34" stroke="#F2A33A" strokeWidth="7" strokeLinecap="round" />
        <circle cx="46" cy="47.5" r="3.5" fill="#0D5C55" />
        <path d="M106 26l6-4M108 34h6" stroke="#F2A33A" strokeWidth="2" strokeLinecap="round" opacity=".7" />
      </symbol>
      <symbol id="al-cam" viewBox="0 0 120 90">
        <rect width="120" height="90" fill="#EEF4F1" />
        <rect x="56" y="14" width="46" height="32" rx="4" fill="#1D3330" stroke="#5D6E69" />
        <circle cx="79" cy="30" r="8" fill="#5D7A74" />
        <rect x="76" y="46" width="6" height="12" fill="#8FA09A" />
        <rect x="66" y="58" width="26" height="5" rx="2" fill="#5D6E69" />
        <rect x="14" y="62" width="48" height="10" rx="5" fill="#FFFFFF" stroke="#AEBDB7" strokeWidth="1.5" />
        <circle cx="20" cy="67" r="2.5" fill="#0D5C55" />
      </symbol>
    </svg>
  );
}

/** The big autoclave drawing used by the «المشتري هيشوفه كده» preview card. */
export function FormArtDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <linearGradient id="ad-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DCE5E1" />
        </linearGradient>
        <linearGradient id="ad-steel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9EEEC" />
          <stop offset=".5" stopColor="#B9C6C1" />
          <stop offset="1" stopColor="#8FA09A" />
        </linearGradient>
        <radialGradient id="ad-glass" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#5D7A74" />
          <stop offset="1" stopColor="#1D3330" />
        </radialGradient>
        <linearGradient id="ad-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EEF4F1" />
          <stop offset="1" stopColor="#D6E3DE" />
        </linearGradient>
      </defs>
      <symbol id="ad-front" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="url(#ad-bg)" />
        <ellipse cx="200" cy="262" rx="150" ry="12" fill="#12221F" opacity=".12" />
        <rect x="70" y="70" width="260" height="185" rx="22" fill="url(#ad-body)" stroke="#AEBDB7" strokeWidth="2" />
        <line x1="70" y1="108" x2="330" y2="108" stroke="#C9D4CF" strokeWidth="2" />
        <rect x="232" y="78" width="78" height="22" rx="6" fill="#12221F" />
        <circle cx="96" cy="89" r="6" fill="#0D5C55" />
        <circle cx="116" cy="89" r="6" fill="#F2A33A" />
        <rect x="134" y="84" width="40" height="10" rx="5" fill="#DCE3DF" />
        <circle cx="182" cy="182" r="58" fill="url(#ad-steel)" stroke="#8FA09A" strokeWidth="3" />
        <circle cx="182" cy="182" r="42" fill="url(#ad-glass)" />
        <path d="M160 160a30 30 0 0 1 26-12" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".45" />
        <rect x="252" y="160" width="14" height="46" rx="7" fill="#8FA09A" />
        <rect x="282" y="128" width="30" height="104" rx="8" fill="#EEF3F1" stroke="#C9D4CF" />
        <circle cx="297" cy="146" r="5" fill="#0D5C55" />
        <rect x="92" y="252" width="26" height="10" rx="3" fill="#5D6E69" />
        <rect x="282" y="252" width="26" height="10" rx="3" fill="#5D6E69" />
      </symbol>
    </svg>
  );
}
