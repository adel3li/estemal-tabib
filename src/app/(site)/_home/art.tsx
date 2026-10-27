// SVG symbols ported from the design file (temporary art, PHASE1_PROMPT.md §2).
export function MainArt() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <linearGradient id="mn-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#DCE5E1" /></linearGradient>
        <linearGradient id="mn-steel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9EEEC" />
          <stop offset=".5" stopColor="#B9C6C1" />
          <stop offset="1" stopColor="#8FA09A" />
        </linearGradient>
        <radialGradient id="mn-glass" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#5D7A74" /><stop offset="1" stopColor="#1D3330" /></radialGradient>
        <linearGradient id="mn-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF4F1" /><stop offset="1" stopColor="#D6E3DE" /></linearGradient>
        <linearGradient id="mn-uph" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C8277" /><stop offset="1" stopColor="#0B4A44" /></linearGradient>
        <linearGradient id="mn-bgblue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF3FA" /><stop offset="1" stopColor="#D3DFF0" /></linearGradient>
        <linearGradient id="mn-bgteal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF6F3" /><stop offset="1" stopColor="#D2E8E2" /></linearGradient>
        <linearGradient id="mn-shield" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C8277" /><stop offset="1" stopColor="#0D5C55" /></linearGradient>
      </defs>
      {/* Dental unit */}
      <symbol id="mn-unit" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="url(#mn-bg)" />
        <circle cx="300" cy="70" r="96" fill="#FFFFFF" opacity=".35" />
        <ellipse cx="205" cy="262" rx="165" ry="12" fill="#12221F" opacity=".12" />
        <path d="M236 60 L196 160 L310 160 L274 60z" fill="#FFF6E3" opacity=".45" />
        <rect x="344" y="38" width="10" height="220" rx="5" fill="url(#mn-steel)" />
        <rect x="252" y="38" width="102" height="9" rx="4.5" fill="#AEBDB7" />
        <rect x="232" y="32" width="46" height="28" rx="11" fill="url(#mn-body)" stroke="#AEBDB7" strokeWidth="2" />
        <rect x="240" y="52" width="30" height="8" rx="4" fill="#FCE3B0" />
        <rect x="332" y="252" width="34" height="10" rx="3" fill="#5D6E69" />
        <path d="M200 212 L126 160" stroke="#9DADA7" strokeWidth="8" strokeLinecap="round" />
        <circle cx="126" cy="160" r="7" fill="#8FA09A" />
        <rect x="70" y="110" width="9" height="34" rx="4.5" fill="url(#mn-steel)" />
        <rect x="88" y="106" width="9" height="38" rx="4.5" fill="url(#mn-steel)" />
        <rect x="106" y="112" width="9" height="32" rx="4.5" fill="url(#mn-steel)" />
        <rect x="56" y="140" width="104" height="18" rx="7" fill="url(#mn-body)" stroke="#AEBDB7" strokeWidth="2" />
        <rect x="124" y="145" width="26" height="8" rx="3" fill="#12221F" />
        <circle cx="130" cy="149" r="2" fill="#7CE0C8" />
        <path d="M74 158 q-8 28 6 52" stroke="#5D6E69" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M92 158 q-4 30 10 50" stroke="#5D6E69" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M110 158 q0 26 12 44" stroke="#5D6E69" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="150" y="238" width="122" height="20" rx="8" fill="url(#mn-steel)" stroke="#8FA09A" strokeWidth="1.5" />
        <rect x="190" y="196" width="42" height="46" rx="6" fill="url(#mn-body)" stroke="#AEBDB7" strokeWidth="2" />
        <rect x="112" y="176" width="172" height="26" rx="13" fill="url(#mn-uph)" />
        <path d="M126 182h140" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity=".22" />
        <g transform="translate(86 210) rotate(61)"><rect x="-13" y="-36" width="26" height="72" rx="13" fill="url(#mn-uph)" /></g>
        <g transform="translate(300 140) rotate(30)">
          <rect x="-16" y="-58" width="32" height="116" rx="16" fill="url(#mn-uph)" />
          <rect x="-8" y="-46" width="4" height="90" rx="2" fill="#FFFFFF" opacity=".2" />
          <rect x="-18" y="-87" width="36" height="25" rx="12.5" fill="url(#mn-uph)" />
        </g>
        <rect x="198" y="162" width="62" height="9" rx="4.5" fill="url(#mn-steel)" />
        <rect x="226" y="169" width="6" height="10" fill="#8FA09A" />
        <rect x="104" y="246" width="34" height="9" rx="4.5" fill="#8FA09A" />
        <ellipse cx="121" cy="256" rx="22" ry="5" fill="#5D6E69" />
        <path d="M138 252 q26 -2 52 -4" stroke="#5D6E69" strokeWidth="3" fill="none" strokeLinecap="round" />
      </symbol>
      {/* Inspection seal */}
      <symbol id="mn-seal" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill="#FFFFFF" />
        <circle cx="60" cy="60" r="49" fill="none" stroke="#9CCBC2" strokeWidth="2" strokeDasharray="4 5" />
        <path d="M60 22l28 11v22c0 18-12 31-28 37-16-6-28-19-28-37V33z" fill="url(#mn-shield)" />
        <path d="M46 58l10 10 19-21" stroke="#FFFFFF" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="96" cy="26" r="9" fill="#F2A33A" />
        <path d="M92 26l3 3 5-6" stroke="#12221F" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      {/* Autoclave */}
      <symbol id="mn-autoclave" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="url(#mn-bg)" />
        <circle cx="90" cy="70" r="80" fill="#FFFFFF" opacity=".35" />
        <ellipse cx="200" cy="262" rx="150" ry="12" fill="#12221F" opacity=".12" />
        <rect x="70" y="70" width="260" height="185" rx="22" fill="url(#mn-body)" stroke="#AEBDB7" strokeWidth="2" />
        <line x1="70" y1="108" x2="330" y2="108" stroke="#C9D4CF" strokeWidth="2" />
        <rect x="232" y="78" width="78" height="22" rx="6" fill="#12221F" />
        <text x="271" y="94" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#7CE0C8">134°C</text>
        <circle cx="96" cy="89" r="6" fill="#0D5C55" />
        <circle cx="116" cy="89" r="6" fill="#F2A33A" />
        <rect x="134" y="84" width="40" height="10" rx="5" fill="#DCE3DF" />
        <circle cx="182" cy="182" r="58" fill="url(#mn-steel)" stroke="#8FA09A" strokeWidth="3" />
        <circle cx="182" cy="182" r="42" fill="url(#mn-glass)" />
        <path d="M160 160a30 30 0 0 1 26-12" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".45" />
        <rect x="252" y="160" width="14" height="46" rx="7" fill="#8FA09A" />
        <rect x="282" y="128" width="30" height="104" rx="8" fill="#EEF3F1" stroke="#C9D4CF" />
        <circle cx="297" cy="146" r="5" fill="#0D5C55" />
        <rect x="289" y="160" width="16" height="4" rx="2" fill="#AEBDB7" />
        <rect x="289" y="170" width="16" height="4" rx="2" fill="#AEBDB7" />
        <rect x="289" y="180" width="16" height="4" rx="2" fill="#AEBDB7" />
        <rect x="92" y="252" width="26" height="10" rx="3" fill="#5D6E69" />
        <rect x="282" y="252" width="26" height="10" rx="3" fill="#5D6E69" />
      </symbol>
      {/* Cordless endo motor */}
      <symbol id="mn-endo" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="url(#mn-bg)" />
        <circle cx="300" cy="80" r="86" fill="#FFFFFF" opacity=".35" />
        <ellipse cx="200" cy="260" rx="130" ry="11" fill="#12221F" opacity=".12" />
        <rect x="100" y="196" width="204" height="58" rx="22" fill="url(#mn-body)" stroke="#AEBDB7" strokeWidth="2" />
        <rect x="202" y="210" width="84" height="30" rx="7" fill="#12221F" />
        <text x="244" y="230" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#7CE0C8">350 rpm</text>
        <rect x="118" y="178" width="66" height="26" rx="11" fill="#EEF3F1" stroke="#C9D4CF" strokeWidth="2" />
        <g transform="translate(182 140) rotate(28) scale(.85)">
          <rect x="-15" y="-74" width="30" height="134" rx="15" fill="url(#mn-steel)" stroke="#8FA09A" strokeWidth="2" />
          <rect x="-15" y="-12" width="30" height="9" fill="#0D5C55" />
          <rect x="-15" y="18" width="30" height="3" fill="#8FA09A" />
          <rect x="-15" y="27" width="30" height="3" fill="#8FA09A" />
          <rect x="-15" y="36" width="30" height="3" fill="#8FA09A" />
          <rect x="-8" y="-100" width="16" height="32" rx="8" fill="url(#mn-steel)" stroke="#8FA09A" strokeWidth="1.5" />
          <circle cx="0" cy="-104" r="12" fill="url(#mn-steel)" stroke="#8FA09A" strokeWidth="2" />
          <path d="M-10 -108 L-44 -116" stroke="#5D6E69" strokeWidth="3" strokeLinecap="round" />
          <path d="M-6 -58 v34" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity=".5" />
        </g>
        <circle cx="126" cy="226" r="7" fill="#0D5C55" />
        <circle cx="150" cy="226" r="7" fill="#FFFFFF" stroke="#C9D4CF" strokeWidth="2" />
        <circle cx="174" cy="226" r="7" fill="#F2A33A" />
      </symbol>
      {/* Wall-mounted X-Ray */}
      <symbol id="mn-xray" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="url(#mn-bg)" />
        <rect x="352" y="0" width="48" height="300" fill="#FFFFFF" opacity=".45" />
        <circle cx="110" cy="230" r="80" fill="#FFFFFF" opacity=".25" />
        <rect x="322" y="48" width="34" height="92" rx="8" fill="url(#mn-body)" stroke="#AEBDB7" strokeWidth="2" />
        <path d="M330 92 L252 130" stroke="#9DADA7" strokeWidth="13" strokeLinecap="round" />
        <path d="M252 130 L182 100" stroke="#9DADA7" strokeWidth="11" strokeLinecap="round" />
        <circle cx="330" cy="92" r="10" fill="#8FA09A" />
        <circle cx="252" cy="130" r="10" fill="#8FA09A" />
        <circle cx="182" cy="100" r="9" fill="#8FA09A" />
        <path d="M182 100 L178 116" stroke="#8FA09A" strokeWidth="8" strokeLinecap="round" />
        <g transform="translate(118 172) rotate(40)">
          <rect x="-15" y="-32" width="30" height="62" rx="7" fill="#F7FAF9" stroke="#AEBDB7" strokeWidth="2" />
          <rect x="-15" y="22" width="30" height="8" fill="#0D5C55" />
        </g>
        <g transform="translate(162 134) rotate(-20)">
          <rect x="-40" y="-25" width="80" height="50" rx="23" fill="url(#mn-body)" stroke="#AEBDB7" strokeWidth="2" />
          <circle cx="14" cy="0" r="10" fill="#E3F0ED" stroke="#9CCBC2" strokeWidth="2" />
          <circle cx="-14" cy="-6" r="5" fill="#F2A33A" />
        </g>
        <rect x="300" y="170" width="60" height="84" rx="11" fill="url(#mn-body)" stroke="#AEBDB7" strokeWidth="2" />
        <rect x="310" y="182" width="40" height="20" rx="4" fill="#12221F" />
        <text x="330" y="196" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#7CE0C8">0.25s</text>
        <circle cx="318" cy="218" r="5" fill="#0D5C55" />
        <circle cx="334" cy="218" r="5" fill="#DCE3DF" />
        <circle cx="318" cy="234" r="5" fill="#DCE3DF" />
        <circle cx="334" cy="234" r="5" fill="#F2A33A" />
      </symbol>
      {/* Semi-permanent instruments */}
      <symbol id="mn-tools" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="url(#mn-bg)" />
        <circle cx="300" cy="80" r="86" fill="#FFFFFF" opacity=".35" />
        <ellipse cx="200" cy="258" rx="150" ry="11" fill="#12221F" opacity=".12" />
        <g transform="translate(270 98) rotate(-8)">
          <rect x="-58" y="-40" width="116" height="80" rx="8" fill="#FFFFFF" stroke="#C9D4CF" strokeWidth="2" />
          <rect x="-58" y="-40" width="116" height="16" rx="8" fill="#9CCBC2" />
          <rect x="-58" y="-30" width="116" height="6" fill="#9CCBC2" />
          <rect x="-40" y="-6" width="60" height="5" rx="2.5" fill="#DCE3DF" />
          <rect x="-40" y="6" width="44" height="5" rx="2.5" fill="#DCE3DF" />
          <circle cx="34" cy="16" r="9" fill="#E3F0ED" stroke="#0D5C55" strokeWidth="2" />
        </g>
        <rect x="64" y="146" width="272" height="102" rx="18" fill="url(#mn-steel)" stroke="#8FA09A" strokeWidth="2" />
        <rect x="78" y="158" width="244" height="78" rx="12" fill="#EEF3F1" />
        <path d="M98 222 L218 180" stroke="#8FA09A" strokeWidth="7" strokeLinecap="round" />
        <circle cx="232" cy="175" r="15" fill="#DCE7E3" stroke="#8FA09A" strokeWidth="3" />
        <path d="M226 170a8 8 0 0 1 8-3" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M120 230 L288 196" stroke="#AEBDB7" strokeWidth="5" strokeLinecap="round" />
        <path d="M288 196 q10 -2 8 -10" stroke="#AEBDB7" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M150 170 q60 10 150 4" stroke="#5D6E69" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M150 178 q60 2 150 -4" stroke="#5D6E69" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="148" cy="174" r="6" fill="none" stroke="#5D6E69" strokeWidth="3" />
      </symbol>
      {/* Inspected: report */}
      <symbol id="mn-report" viewBox="0 0 600 200">
        <rect width="600" height="200" fill="url(#mn-bgteal)" />
        <g transform="translate(100 16)">
          <circle cx="80" cy="30" r="70" fill="#FFFFFF" opacity=".4" />
          <rect x="144" y="18" width="112" height="146" rx="14" fill="#FFFFFF" stroke="#9CCBC2" strokeWidth="2" />
          <rect x="176" y="10" width="48" height="18" rx="8" fill="#0D5C55" />
          <circle cx="166" cy="54" r="8" fill="#E3F0ED" />
          <path d="M162 54l3 3 5-6" stroke="#0D5C55" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="182" y="50" width="56" height="7" rx="3.5" fill="#DCE3DF" />
          <circle cx="166" cy="80" r="8" fill="#E3F0ED" />
          <path d="M162 80l3 3 5-6" stroke="#0D5C55" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="182" y="76" width="44" height="7" rx="3.5" fill="#DCE3DF" />
          <circle cx="166" cy="106" r="8" fill="#E3F0ED" />
          <path d="M162 106l3 3 5-6" stroke="#0D5C55" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="182" y="102" width="52" height="7" rx="3.5" fill="#DCE3DF" />
          <circle cx="166" cy="132" r="8" fill="#FBEEDC" />
          <rect x="165" y="127" width="2" height="6" rx="1" fill="#8A4209" />
          <circle cx="166" cy="136" r="1.2" fill="#8A4209" />
          <rect x="182" y="128" width="36" height="7" rx="3.5" fill="#DCE3DF" />
          <g transform="translate(266 120)">
            <circle r="26" fill="url(#mn-shield)" />
            <circle r="20" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" opacity=".7" />
            <path d="M-9 0l6 6 12-13" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </symbol>
      {/* On-order: visit at seller */}
      <symbol id="mn-visit" viewBox="0 0 600 200">
        <rect width="600" height="200" fill="url(#mn-bgblue)" />
        <g transform="translate(100 16)">
          <circle cx="320" cy="30" r="70" fill="#FFFFFF" opacity=".4" />
          <ellipse cx="180" cy="150" rx="90" ry="8" fill="#12221F" opacity=".1" />
          <rect x="110" y="62" width="140" height="86" rx="14" fill="url(#mn-body)" stroke="#AEBDB7" strokeWidth="2" />
          <line x1="110" y1="82" x2="250" y2="82" stroke="#C9D4CF" strokeWidth="2" />
          <rect x="200" y="67" width="40" height="11" rx="3" fill="#12221F" />
          <circle cx="164" cy="116" r="24" fill="url(#mn-steel)" stroke="#8FA09A" strokeWidth="2" />
          <circle cx="164" cy="116" r="16" fill="url(#mn-glass)" />
          <circle cx="236" cy="96" r="38" fill="#FFFFFF" fillOpacity=".35" stroke="#24508F" strokeWidth="8" />
          <path d="M263 123 L292 152" stroke="#24508F" strokeWidth="12" strokeLinecap="round" />
          <path d="M220 82a20 20 0 0 1 16-6" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          <g transform="translate(330 120)">
            <circle r="20" fill="#FFFFFF" stroke="#A9BFE0" strokeWidth="2" />
            <path d="M0 -10v10l7 5" stroke="#24508F" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </symbol>
      {/* Escrow / warranty (for dark section) */}
      <symbol id="mn-escrow" viewBox="0 0 360 300">
        <circle cx="180" cy="150" r="128" fill="none" stroke="#2E5650" strokeWidth="2" strokeDasharray="6 8" />
        <circle cx="180" cy="150" r="92" fill="#173A35" />
        <path d="M180 62l70 27v54c0 45-30 77-70 92-40-15-70-47-70-92V89z" fill="url(#mn-shield)" stroke="#F2A33A" strokeWidth="3" />
        <rect x="150" y="142" width="60" height="48" rx="10" fill="#FFFFFF" />
        <path d="M161 142v-14a19 19 0 0 1 38 0v14" stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="180" cy="162" r="6" fill="#0D5C55" />
        <rect x="177" y="164" width="6" height="14" rx="3" fill="#0D5C55" />
        <g transform="translate(52 150)">
          <circle r="26" fill="#0F2A26" stroke="#F2A33A" strokeWidth="2" />
          <path d="M-10 -2a11 11 0 0 1 19-6l3 3M12 -10v5h-5M10 2a11 11 0 0 1-19 6l-3-3M-12 10v-5h5" stroke="#F2A33A" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g transform="translate(308 150)">
          <circle r="26" fill="#0F2A26" stroke="#F2A33A" strokeWidth="2" />
          <path d="M4 -10a6 6 0 0 0-8 8l-8 8 4 4 8-8a6 6 0 0 0 8-8l-4 4-3-1-1-3z" stroke="#F2A33A" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g transform="translate(180 22)">
          <circle r="20" fill="#0F2A26" stroke="#F2A33A" strokeWidth="2" />
          <path d="M-7 0l5 5 9-10" stroke="#F2A33A" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <circle cx="180" cy="278" r="5" fill="#F2A33A" />
      </symbol>
    </svg>
  );
}
