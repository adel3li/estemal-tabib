// SVG symbols ported from the design file (temporary art, PHASE1_PROMPT.md §2).
export function AboutArt() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <linearGradient id="ab-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#DCE5E1" /></linearGradient>
        <linearGradient id="ab-steel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9EEEC" />
          <stop offset=".5" stopColor="#B9C6C1" />
          <stop offset="1" stopColor="#8FA09A" />
        </linearGradient>
        <radialGradient id="ab-glass" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#5D7A74" /><stop offset="1" stopColor="#1D3330" /></radialGradient>
        <linearGradient id="ab-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF4F1" /><stop offset="1" stopColor="#D6E3DE" /></linearGradient>
        <linearGradient id="ab-uph" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C8277" /><stop offset="1" stopColor="#0B4A44" /></linearGradient>
        <linearGradient id="ab-shield" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C8277" /><stop offset="1" stopColor="#0D5C55" /></linearGradient>
      </defs>
      {/* Seller -> platform (inspect, hold money) -> buyer. RTL: seller on the right. */}
      <symbol id="ab-bridge" viewBox="0 0 520 320">
        <rect width="520" height="320" fill="url(#ab-bg)" />
        <circle cx="260" cy="150" r="120" fill="#FFFFFF" opacity=".4" />
        <ellipse cx="260" cy="282" rx="230" ry="12" fill="#12221F" opacity=".08" />
        {/* seller clinic (right) */}
        <g transform="translate(386 132)">
          <rect x="0" y="0" width="112" height="146" rx="12" fill="#FFFFFF" stroke="#C9D4CF" strokeWidth="2" />
          <rect x="0" y="0" width="112" height="30" rx="12" fill="#F2A33A" />
          <rect x="0" y="18" width="112" height="12" fill="#F2A33A" />
          <circle cx="56" cy="15" r="11" fill="#FFFFFF" />
          <g transform="translate(47 6) scale(.75)">
            <path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7 .5 3 1 6.5 2.5 6.5S9 18 10 15.5c.5-1.2 1.5-1.2 2 0 1 2.5 1.5 5.5 3 5.5s2-3.5 2.5-6.5c.5-2.5 2-4 2-7C19.5 5 18 3 15.5 3 13.5 3 13 4 12 4S10 3 7 3z" fill="none" stroke="#C46A12" strokeWidth="2" />
          </g>
          <rect x="14" y="44" width="36" height="30" rx="5" fill="#E6EDF7" stroke="#C6D4EA" />
          <rect x="62" y="44" width="36" height="30" rx="5" fill="#E6EDF7" stroke="#C6D4EA" />
          <rect x="40" y="98" width="32" height="48" rx="4" fill="#DCE3DF" />
          <circle cx="66" cy="124" r="2" fill="#8FA09A" />
        </g>
        <text x="442" y="306" textAnchor="middle" fontFamily="IBM Plex Sans Arabic, sans-serif" fontSize="16" fontWeight="700" fill="#4A5A56">البايع</text>
        {/* buyer clinic (left) */}
        <g transform="translate(22 132)">
          <rect x="0" y="0" width="112" height="146" rx="12" fill="#FFFFFF" stroke="#C9D4CF" strokeWidth="2" />
          <rect x="0" y="0" width="112" height="30" rx="12" fill="#0D5C55" />
          <rect x="0" y="18" width="112" height="12" fill="#0D5C55" />
          <circle cx="56" cy="15" r="11" fill="#FFFFFF" />
          <g transform="translate(47 6) scale(.75)">
            <path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7 .5 3 1 6.5 2.5 6.5S9 18 10 15.5c.5-1.2 1.5-1.2 2 0 1 2.5 1.5 5.5 3 5.5s2-3.5 2.5-6.5c.5-2.5 2-4 2-7C19.5 5 18 3 15.5 3 13.5 3 13 4 12 4S10 3 7 3z" fill="none" stroke="#0D5C55" strokeWidth="2" />
          </g>
          <rect x="14" y="44" width="36" height="30" rx="5" fill="#E3F0ED" stroke="#9CCBC2" />
          <rect x="62" y="44" width="36" height="30" rx="5" fill="#E3F0ED" stroke="#9CCBC2" />
          <rect x="40" y="98" width="32" height="48" rx="4" fill="#DCE3DF" />
          <circle cx="46" cy="124" r="2" fill="#8FA09A" />
        </g>
        <text x="78" y="306" textAnchor="middle" fontFamily="IBM Plex Sans Arabic, sans-serif" fontSize="16" fontWeight="700" fill="#4A5A56">المشتري</text>
        {/* paths */}
        <path d="M380 214 H316" stroke="#9FB2AB" strokeWidth="3" strokeDasharray="7 7" fill="none" strokeLinecap="round" />
        <path d="M322 206 l-10 8 10 8" stroke="#9FB2AB" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M204 214 H146" stroke="#9FB2AB" strokeWidth="3" strokeDasharray="7 7" fill="none" strokeLinecap="round" />
        <path d="M152 206 l-10 8 10 8" stroke="#9FB2AB" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* device on the way in (small autoclave) */}
        <g transform="translate(320 160)">
          <rect x="0" y="0" width="56" height="42" rx="8" fill="url(#ab-body)" stroke="#AEBDB7" strokeWidth="2" />
          <line x1="0" y1="11" x2="56" y2="11" stroke="#C9D4CF" strokeWidth="1.5" />
          <rect x="34" y="3" width="16" height="6" rx="2" fill="#12221F" />
          <circle cx="24" cy="27" r="10" fill="url(#ab-steel)" stroke="#8FA09A" strokeWidth="1.5" />
          <circle cx="24" cy="27" r="6" fill="url(#ab-glass)" />
        </g>
        {/* truck on the way out */}
        <g transform="translate(148 168)">
          <rect x="18" y="0" width="38" height="28" rx="4" fill="#3F7A1F" />
          <path d="M18 10 H6 l-6 8 v10 h18z" fill="#EAF5DD" stroke="#3F7A1F" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="32" r="6" fill="#12221F" />
          <circle cx="44" cy="32" r="6" fill="#12221F" />
          <circle cx="12" cy="32" r="2.5" fill="#DCE3DF" />
          <circle cx="44" cy="32" r="2.5" fill="#DCE3DF" />
        </g>
        {/* platform shield */}
        <circle cx="260" cy="190" r="62" fill="#FFFFFF" stroke="#9CCBC2" strokeWidth="2" strokeDasharray="5 6" />
        <path d="M260 140l42 16v32c0 27-18 46-42 55-24-9-42-28-42-55v-32z" fill="url(#ab-shield)" />
        <path d="M243 192l12 12 22-25" stroke="#FFFFFF" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <g transform="translate(312 128)">
          <circle r="18" fill="#FFFFFF" stroke="#A9BFE0" strokeWidth="2" />
          <circle cx="-2" cy="-2" r="7" fill="none" stroke="#24508F" strokeWidth="2.6" />
          <path d="M3 3l6 6" stroke="#24508F" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <g transform="translate(208 128)">
          <circle r="18" fill="#FFFFFF" stroke="#F0C88A" strokeWidth="2" />
          <rect x="-8" y="-3" width="16" height="12" rx="3" fill="#C46A12" />
          <path d="M-5 -3v-3a5 5 0 0 1 10 0v3" stroke="#C46A12" strokeWidth="2.4" fill="none" />
        </g>
        <g transform="translate(260 72)">
          <rect x="-76" y="-18" width="152" height="36" rx="18" fill="#0D5C55" />
          <g transform="translate(44 -10) scale(.85)">
            <path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7 .5 3 1 6.5 2.5 6.5S9 18 10 15.5c.5-1.2 1.5-1.2 2 0 1 2.5 1.5 5.5 3 5.5s2-3.5 2.5-6.5c.5-2.5 2-4 2-7C19.5 5 18 3 15.5 3 13.5 3 13 4 12 4S10 3 7 3z" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <text x="-10" y="6" textAnchor="middle" fontFamily="IBM Plex Sans Arabic, sans-serif" fontSize="15" fontWeight="700" fill="#FFFFFF">استعمال طبيب</text>
        </g>
        <path d="M260 90 v36" stroke="#9CCBC2" strokeWidth="2" strokeDasharray="4 4" />
      </symbol>
      {/* Compact dental unit for CTA */}
      <symbol id="ab-unit" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="url(#ab-bg)" />
        <circle cx="300" cy="70" r="96" fill="#FFFFFF" opacity=".35" />
        <ellipse cx="205" cy="262" rx="165" ry="12" fill="#12221F" opacity=".12" />
        <path d="M236 60 L196 160 L310 160 L274 60z" fill="#FFF6E3" opacity=".45" />
        <rect x="344" y="38" width="10" height="220" rx="5" fill="url(#ab-steel)" />
        <rect x="252" y="38" width="102" height="9" rx="4.5" fill="#AEBDB7" />
        <rect x="232" y="32" width="46" height="28" rx="11" fill="url(#ab-body)" stroke="#AEBDB7" strokeWidth="2" />
        <rect x="240" y="52" width="30" height="8" rx="4" fill="#FCE3B0" />
        <rect x="332" y="252" width="34" height="10" rx="3" fill="#5D6E69" />
        <path d="M200 212 L126 160" stroke="#9DADA7" strokeWidth="8" strokeLinecap="round" />
        <circle cx="126" cy="160" r="7" fill="#8FA09A" />
        <rect x="70" y="110" width="9" height="34" rx="4.5" fill="url(#ab-steel)" />
        <rect x="88" y="106" width="9" height="38" rx="4.5" fill="url(#ab-steel)" />
        <rect x="106" y="112" width="9" height="32" rx="4.5" fill="url(#ab-steel)" />
        <rect x="56" y="140" width="104" height="18" rx="7" fill="url(#ab-body)" stroke="#AEBDB7" strokeWidth="2" />
        <rect x="124" y="145" width="26" height="8" rx="3" fill="#12221F" />
        <path d="M74 158 q-8 28 6 52" stroke="#5D6E69" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M92 158 q-4 30 10 50" stroke="#5D6E69" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="150" y="238" width="122" height="20" rx="8" fill="url(#ab-steel)" stroke="#8FA09A" strokeWidth="1.5" />
        <rect x="190" y="196" width="42" height="46" rx="6" fill="url(#ab-body)" stroke="#AEBDB7" strokeWidth="2" />
        <rect x="112" y="176" width="172" height="26" rx="13" fill="url(#ab-uph)" />
        <g transform="translate(86 210) rotate(61)"><rect x="-13" y="-36" width="26" height="72" rx="13" fill="url(#ab-uph)" /></g>
        <g transform="translate(300 140) rotate(30)">
          <rect x="-16" y="-58" width="32" height="116" rx="16" fill="url(#ab-uph)" />
          <rect x="-18" y="-87" width="36" height="25" rx="12.5" fill="url(#ab-uph)" />
        </g>
        <rect x="198" y="162" width="62" height="9" rx="4.5" fill="url(#ab-steel)" />
        <g transform="translate(62 40)">
          <circle r="30" fill="#FFFFFF" />
          <path d="M0 -18l15 6v11c0 10-6 16-15 20-9-4-15-10-15-20v-11z" fill="url(#ab-shield)" />
          <path d="M-6 0l4 4 8-9" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </symbol>
    </svg>
  );
}
