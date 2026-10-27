// Illustrations from Admin-Submissions.dc.html (sb-*).
import type { DeviceType } from "@/lib/demo/types";

export function artFor(type: DeviceType): string {
  switch (type) {
    case "unit":
      return "#sb-unit";
    case "autoclave":
      return "#sb-clave";
    case "xray":
      return "#sb-xray";
    case "cure":
      return "#sb-cure";
    default:
      return "#sb-motor";
  }
}

export function SubmissionArtDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <symbol id="sb-unit" viewBox="0 0 120 90">
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
      <symbol id="sb-clave" viewBox="0 0 120 90">
        <rect width="120" height="90" fill="#EEF4F1" />
        <ellipse cx="60" cy="80" rx="40" ry="4" fill="#12221F" opacity=".1" />
        <rect x="24" y="20" width="72" height="56" rx="9" fill="#FFFFFF" stroke="#AEBDB7" strokeWidth="1.5" />
        <circle cx="52" cy="50" r="18" fill="#B9C6C1" stroke="#8FA09A" />
        <circle cx="52" cy="50" r="12" fill="#1D3330" />
        <rect x="76" y="28" width="14" height="8" rx="2" fill="#12221F" />
        <circle cx="83" cy="52" r="3" fill="#0D5C55" />
        <circle cx="83" cy="62" r="3" fill="#F2A33A" />
      </symbol>
      <symbol id="sb-xray" viewBox="0 0 120 90">
        <rect width="120" height="90" fill="#EEF4F1" />
        <rect x="18" y="12" width="10" height="44" rx="3" fill="#8FA09A" />
        <path d="M28 24L62 32L80 46" stroke="#AEBDB7" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="62" cy="32" r="4" fill="#5D6E69" />
        <rect x="72" y="42" width="24" height="18" rx="5" fill="#FFFFFF" stroke="#AEBDB7" strokeWidth="1.5" />
        <path d="M79 60h10l-2 16h-6z" fill="#F2A33A" />
        <circle cx="84" cy="51" r="3" fill="#0D5C55" />
      </symbol>
      <symbol id="sb-motor" viewBox="0 0 120 90">
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
      <symbol id="sb-cure" viewBox="0 0 120 90">
        <rect width="120" height="90" fill="#EEF4F1" />
        <rect x="30" y="64" width="44" height="9" rx="4" fill="#5D6E69" />
        <rect x="20" y="40" width="70" height="15" rx="7.5" fill="#FFFFFF" stroke="#AEBDB7" strokeWidth="1.5" />
        <path d="M88 46L104 34" stroke="#F2A33A" strokeWidth="7" strokeLinecap="round" />
        <circle cx="46" cy="47.5" r="3.5" fill="#0D5C55" />
        <path d="M106 26l6-4M108 34h6" stroke="#F2A33A" strokeWidth="2" strokeLinecap="round" opacity=".7" />
      </symbol>
    </svg>
  );
}
