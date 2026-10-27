// SVG symbols ported from the design file (temporary art, PHASE1_PROMPT.md §2).
export function TermsArt() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <linearGradient id="tm-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF4F1" /><stop offset="1" stopColor="#D6E3DE" /></linearGradient>
        <linearGradient id="tm-paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E9EFEC" /></linearGradient>
        <linearGradient id="tm-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1A7A70" /><stop offset="1" stopColor="#0B4A44" /></linearGradient>
        <linearGradient id="tm-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".35" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <symbol id="tm-hero" viewBox="0 0 400 300">
        <rect width="400" height="300" rx="0" fill="url(#tm-bg)" />
        <circle cx="330" cy="64" r="34" fill="#FFFFFF" opacity=".5" />
        <circle cx="70" cy="230" r="22" fill="#FFFFFF" opacity=".45" />
        <ellipse cx="200" cy="268" rx="140" ry="11" fill="#12221F" opacity=".12" />
        <g transform="rotate(-6 170 150)">
          <rect x="98" y="48" width="150" height="196" rx="16" fill="#FFFFFF" stroke="#C9D4CF" strokeWidth="2" />
        </g>
        <rect x="112" y="40" width="156" height="208" rx="16" fill="url(#tm-paper)" stroke="#AEBDB7" strokeWidth="2" />
        <rect x="132" y="62" width="70" height="10" rx="5" fill="#0D5C55" />
        <rect x="132" y="84" width="116" height="6" rx="3" fill="#C9D4CF" />
        <rect x="132" y="98" width="104" height="6" rx="3" fill="#C9D4CF" />
        <rect x="132" y="112" width="112" height="6" rx="3" fill="#C9D4CF" />
        <circle cx="138" cy="138" r="6" fill="#E3F0ED" stroke="#0D5C55" strokeWidth="2" />
        <path d="M135 138l2 2 4-4" stroke="#0D5C55" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="152" y="135" width="84" height="6" rx="3" fill="#DCE3DF" />
        <circle cx="138" cy="160" r="6" fill="#E3F0ED" stroke="#0D5C55" strokeWidth="2" />
        <path d="M135 160l2 2 4-4" stroke="#0D5C55" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="152" y="157" width="70" height="6" rx="3" fill="#DCE3DF" />
        <circle cx="138" cy="182" r="6" fill="#FBEEDC" stroke="#C46A12" strokeWidth="2" />
        <rect x="152" y="179" width="78" height="6" rx="3" fill="#DCE3DF" />
        <path d="M134 222c8-10 14 6 22-4s12 2 20-2" stroke="#24508F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="132" y="230" width="60" height="2" rx="1" fill="#AEBDB7" />
        <path d="M268 110l52 20v40c0 34-22 58-52 70-30-12-52-36-52-70v-40z" fill="url(#tm-shield)" />
        <path d="M268 110l52 20v40c0 34-22 58-52 70z" fill="#12221F" opacity=".12" />
        <path d="M268 122l40 15v33c0 26-16 45-40 56-24-11-40-30-40-56v-33z" fill="url(#tm-shine)" />
        <path d="M252 150c-6 0-10 4-10 10 0 7 3 10 4 15 1 6 2 13 5 13s4-6 6-11c1-2 3-2 4 0 2 5 3 11 6 11s4-7 5-13c1-5 4-8 4-15 0-6-4-10-10-10-4 0-5 2-7 2s-3-2-7-2z" fill="#FFFFFF" />
        <circle cx="306" cy="212" r="20" fill="#F2A33A" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M297 212l6 6 11-11" stroke="#12221F" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <g fill="#F2A33A"><circle cx="92" cy="80" r="4" /><circle cx="340" cy="120" r="3" /></g>
        <path d="M352 186l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="#FFFFFF" opacity=".9" />
      </symbol>
    </svg>
  );
}
