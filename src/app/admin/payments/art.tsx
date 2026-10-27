import type { Payment } from "@/lib/demo/orders";

export const PmIcon = ({ icon }: { icon: Payment["icon"] }) => (
  <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" style={{ flex: "none" }}>
    <use href={`#pm-ic-${icon}`} />
  </svg>
);

/** Hidden sprite (from Admin-Payments.dc.html). */
export function PmSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <symbol id="pm-ic-unit" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#E3F0ED" /><path d="M11 27h18" stroke="#0D5C55" strokeWidth="2.4" strokeLinecap="round" /><path d="M13 27l2-9h8l3 4h4" stroke="#0D5C55" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M15 18l-1-6" stroke="#0D5C55" strokeWidth="2.4" strokeLinecap="round" /><circle cx="27" cy="12" r="3" fill="#F2A33A" /><path d="M27 15v4" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" /></symbol>
      <symbol id="pm-ic-box" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#E6EDF7" /><rect x="9" y="11" width="22" height="18" rx="4" fill="#FFFFFF" stroke="#24508F" strokeWidth="2" /><circle cx="18" cy="20" r="5" fill="#24508F" opacity=".85" /><rect x="25" y="15" width="3" height="10" rx="1.5" fill="#24508F" /><rect x="11" y="29" width="4" height="2" rx="1" fill="#24508F" /><rect x="25" y="29" width="4" height="2" rx="1" fill="#24508F" /></symbol>
      <symbol id="pm-ic-hand" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#FBEEDC" /><path d="M10 28l14-14" stroke="#8A4209" strokeWidth="4" strokeLinecap="round" /><path d="M24 14l4-4" stroke="#8A4209" strokeWidth="2.4" strokeLinecap="round" /><circle cx="29" cy="9" r="2" fill="#F2A33A" /><path d="M10 28c-1 1-2 3-1 4s3 0 4-1" stroke="#8A4209" strokeWidth="2" fill="none" strokeLinecap="round" /></symbol>
      <symbol id="pm-ic-cam" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#EAF5DD" /><rect x="9" y="14" width="22" height="14" rx="3" fill="#FFFFFF" stroke="#3F7A1F" strokeWidth="2" /><circle cx="20" cy="21" r="4" fill="#3F7A1F" /><rect x="15" y="11" width="10" height="4" rx="1.5" fill="#3F7A1F" /></symbol>
    </svg>
  );
}
