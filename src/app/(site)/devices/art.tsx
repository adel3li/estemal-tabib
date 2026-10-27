// SVG art ported from design-reference/Browse.dc.html (ids kept page-prefixed).
export function BrowseArt() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>

<defs>
<linearGradient id="br-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF4F1" /><stop offset="1" stopColor="#D6E3DE" /></linearGradient>
<linearGradient id="br-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#DCE5E1" /></linearGradient>
<linearGradient id="br-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E9EEEC" /><stop offset=".5" stopColor="#B9C6C1" /><stop offset="1" stopColor="#8FA09A" /></linearGradient>
<radialGradient id="br-glass" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#5D7A74" /><stop offset="1" stopColor="#1D3330" /></radialGradient>
<linearGradient id="br-teal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#23847A" /><stop offset="1" stopColor="#0D5C55" /></linearGradient>
</defs>

<symbol id="br-unit" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<ellipse cx="215" cy="258" rx="165" ry="12" fill="#12221F" opacity=".12" />
<path d="M226 186V74q0-16-16-16h-46" fill="none" stroke="#8FA09A" strokeWidth="7" strokeLinecap="round" />
<rect x="118" y="44" width="54" height="26" rx="13" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<ellipse cx="145" cy="66" rx="18" ry="5" fill="#FFE7B0" />
<rect x="128" y="244" width="160" height="14" rx="7" fill="#5D6E69" />
<rect x="190" y="196" width="36" height="52" rx="8" fill="url(#br-steel)" />
<path d="M124 184L86 112L106 102L146 178Z" fill="#1A7268" stroke="#1A7268" strokeWidth="12" strokeLinejoin="round" />
<rect x="80" y="74" width="20" height="38" rx="10" fill="#0D5C55" transform="rotate(-28 90 93)" />
<rect x="112" y="176" width="186" height="30" rx="15" fill="url(#br-teal)" />
<path d="M292 188L334 216L326 226L286 202Z" fill="#1A7268" stroke="#1A7268" strokeWidth="10" strokeLinejoin="round" />
<rect x="152" y="158" width="70" height="10" rx="5" fill="#C9D4CF" />
<rect x="210" y="166" width="6" height="12" fill="#AEBDB7" />
<path d="M130 186h150" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity=".35" />
<rect x="350" y="126" width="8" height="122" rx="4" fill="url(#br-steel)" />
<rect x="330" y="244" width="48" height="10" rx="5" fill="#5D6E69" />
<rect x="316" y="108" width="78" height="22" rx="7" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<rect x="326" y="88" width="7" height="22" rx="3.5" fill="#3C4C48" />
<rect x="342" y="84" width="7" height="26" rx="3.5" fill="#5D6E69" />
<rect x="358" y="88" width="7" height="22" rx="3.5" fill="#3C4C48" />
<rect x="374" y="92" width="7" height="18" rx="3.5" fill="#F2A33A" />
</symbol>

<symbol id="br-autoclave" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<ellipse cx="200" cy="262" rx="150" ry="12" fill="#12221F" opacity=".12" />
<rect x="70" y="70" width="260" height="185" rx="22" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<line x1="70" y1="108" x2="330" y2="108" stroke="#C9D4CF" strokeWidth="2" />
<rect x="232" y="78" width="78" height="22" rx="6" fill="#12221F" />
<text x="271" y="94" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#7CE0C8">134°C</text>
<circle cx="96" cy="89" r="6" fill="#0D5C55" />
<circle cx="116" cy="89" r="6" fill="#F2A33A" />
<rect x="134" y="84" width="40" height="10" rx="5" fill="#DCE3DF" />
<circle cx="182" cy="182" r="58" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="3" />
<circle cx="182" cy="182" r="42" fill="url(#br-glass)" />
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

<symbol id="br-xray" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<rect x="0" y="0" width="34" height="300" fill="#DCE5E1" />
<ellipse cx="240" cy="266" rx="120" ry="10" fill="#12221F" opacity=".08" />
<rect x="34" y="56" width="70" height="124" rx="12" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<circle cx="69" cy="100" r="12" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="2" />
<path d="M76 100L190 132" stroke="url(#br-steel)" strokeWidth="16" strokeLinecap="round" />
<path d="M76 100L190 132" stroke="#8FA09A" strokeWidth="2" strokeLinecap="round" opacity=".5" />
<circle cx="190" cy="132" r="13" fill="#E9EEEC" stroke="#8FA09A" strokeWidth="2" />
<path d="M190 132L252 100" stroke="url(#br-steel)" strokeWidth="13" strokeLinecap="round" />
<circle cx="252" cy="100" r="10" fill="#E9EEEC" stroke="#8FA09A" strokeWidth="2" />
<path d="M252 100v38" stroke="#8FA09A" strokeWidth="8" strokeLinecap="round" />
<rect x="214" y="134" width="80" height="58" rx="20" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<path d="M240 178l9-15 9 15z" fill="#F2A33A" />
<rect x="268" y="146" width="16" height="6" rx="3" fill="#0D5C55" />
<path d="M292 148L344 138L350 196L292 180Z" fill="#F7FAF9" stroke="#AEBDB7" strokeWidth="2" strokeLinejoin="round" />
<ellipse cx="347" cy="167" rx="7" ry="28" fill="#3C4C48" />
<ellipse cx="347" cy="167" rx="3" ry="16" fill="#12221F" />
<rect x="46" y="200" width="46" height="58" rx="9" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<rect x="53" y="208" width="32" height="14" rx="3" fill="#12221F" />
<text x="69" y="219" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#7CE0C8">0.25</text>
<circle cx="69" cy="240" r="8" fill="#0D5C55" />
<path d="M69 180v20" stroke="#5D6E69" strokeWidth="3" />
</symbol>

<symbol id="br-apex" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<ellipse cx="200" cy="254" rx="130" ry="11" fill="#12221F" opacity=".12" />
<path d="M270 196C322 204 334 240 304 256C290 263 274 252 262 254" fill="none" stroke="#3C4C48" strokeWidth="4" strokeLinecap="round" />
<path d="M270 172C318 168 340 128 328 104" fill="none" stroke="#3C4C48" strokeWidth="4" strokeLinecap="round" />
<path d="M328 104q-6-16-22-8q-6 4-2 12" fill="none" stroke="#8FA09A" strokeWidth="6" strokeLinecap="round" />
<rect x="240" y="248" width="24" height="12" rx="4" fill="#F2A33A" />
<rect x="110" y="88" width="162" height="156" rx="26" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<rect x="128" y="106" width="126" height="86" rx="10" fill="#12221F" />
<line x1="158" y1="112" x2="158" y2="168" stroke="#F2A33A" strokeWidth="2" />
<path d="M150 120c-6 0-10 5-10 13 0 8 4 13 6 20l3 20c1 4 4 4 5 0l3-16 3 16c1 4 4 4 5 0l3-20c2-7 6-12 6-20 0-8-4-13-10-13-4 0-5 2-7 2s-3-2-7-2z" fill="none" stroke="#7CE0C8" strokeWidth="2" />
<rect x="200" y="166" width="9" height="14" rx="2" fill="#7CE0C8" />
<rect x="214" y="156" width="9" height="24" rx="2" fill="#7CE0C8" />
<rect x="228" y="144" width="9" height="36" rx="2" fill="#F2A33A" />
<text x="218" y="130" textAnchor="middle" fontFamily="monospace" fontSize="14" fill="#7CE0C8">0.5</text>
<circle cx="146" cy="216" r="10" fill="#0D5C55" />
<circle cx="176" cy="216" r="10" fill="#FFFFFF" stroke="#C9D4CF" strokeWidth="2" />
<rect x="202" y="208" width="48" height="16" rx="8" fill="#DCE3DF" />
</symbol>

<symbol id="br-contra" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<ellipse cx="200" cy="246" rx="150" ry="11" fill="#12221F" opacity=".12" />
<g transform="rotate(-14 200 160)">
<rect x="44" y="146" width="34" height="34" rx="8" fill="#8FA09A" />
<rect x="36" y="154" width="12" height="18" rx="3" fill="#5D6E69" />
<path d="M74 146L262 154L262 174L74 182Z" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="2" strokeLinejoin="round" />
<rect x="92" y="147" width="10" height="34" fill="#0D5C55" />
<g stroke="#8FA09A" strokeWidth="2">
<line x1="124" y1="150" x2="124" y2="178" />
<line x1="134" y1="150" x2="134" y2="178" />
<line x1="144" y1="151" x2="144" y2="177" />
<line x1="154" y1="151" x2="154" y2="177" />
</g>
<path d="M170 157L252 160" stroke="#FFFFFF" strokeWidth="3" opacity=".6" strokeLinecap="round" />
<path d="M260 154L300 128L318 146L260 174Z" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="2" strokeLinejoin="round" />
<circle cx="312" cy="134" r="20" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="2" />
<circle cx="312" cy="134" r="11" fill="#F7FAF9" stroke="#AEBDB7" />
<path d="M318 152L328 186" stroke="#5D6E69" strokeWidth="4" strokeLinecap="round" />
<circle cx="329" cy="188" r="4" fill="#AEBDB7" />
</g>
</symbol>

<symbol id="br-surg" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<ellipse cx="210" cy="262" rx="160" ry="12" fill="#12221F" opacity=".12" />
<rect x="258" y="40" width="6" height="84" rx="3" fill="url(#br-steel)" />
<path d="M261 46h28" stroke="#8FA09A" strokeWidth="4" strokeLinecap="round" />
<rect x="272" y="52" width="36" height="54" rx="12" fill="#DCEAF5" stroke="#A9BFE0" strokeWidth="2" />
<rect x="278" y="72" width="24" height="28" rx="6" fill="#BFD5EC" opacity=".8" />
<path d="M290 106C292 140 300 170 330 186" fill="none" stroke="#A9BFE0" strokeWidth="3" />
<rect x="76" y="118" width="196" height="124" rx="20" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<rect x="96" y="136" width="114" height="60" rx="8" fill="#12221F" />
<text x="153" y="164" textAnchor="middle" fontFamily="monospace" fontSize="20" fill="#7CE0C8">35 Ncm</text>
<text x="153" y="184" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="#7CE0C8" opacity=".7">1200 rpm</text>
<circle cx="240" cy="152" r="11" fill="#0D5C55" />
<circle cx="240" cy="182" r="11" fill="#FFFFFF" stroke="#C9D4CF" strokeWidth="2" />
<rect x="96" y="210" width="30" height="16" rx="5" fill="#E3F0ED" stroke="#9CCBC2" />
<rect x="134" y="210" width="30" height="16" rx="5" fill="#FFFFFF" stroke="#C9D4CF" />
<rect x="172" y="210" width="30" height="16" rx="5" fill="#FFFFFF" stroke="#C9D4CF" />
<path d="M272 210C312 206 320 196 334 190" fill="none" stroke="#3C4C48" strokeWidth="4" strokeLinecap="round" />
<rect x="330" y="176" width="58" height="14" rx="7" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="1.5" transform="rotate(-30 340 183)" />
<path d="M262 242C268 252 280 256 296 254" fill="none" stroke="#3C4C48" strokeWidth="3" />
<rect x="294" y="244" width="84" height="20" rx="10" fill="#3C4C48" />
<rect x="304" y="236" width="62" height="12" rx="6" fill="#5D6E69" />
</symbol>

<symbol id="br-cure" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<ellipse cx="200" cy="260" rx="150" ry="11" fill="#12221F" opacity=".12" />
<rect x="70" y="214" width="170" height="40" rx="18" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<rect x="96" y="210" width="110" height="10" rx="5" fill="#C9D4CF" />
<circle cx="222" cy="236" r="4" fill="#0D5C55" />
<g transform="rotate(-16 210 170)">
<rect x="96" y="150" width="210" height="36" rx="18" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<path d="M114 158h170" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity=".8" />
<rect x="160" y="160" width="40" height="16" rx="8" fill="#0D5C55" />
<rect x="214" y="161" width="34" height="14" rx="4" fill="#12221F" />
<text x="231" y="172" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#7CE0C8">20s</text>
<path d="M304 158L330 162L330 174L304 178Z" fill="#AEBDB7" />
<path d="M330 168Q362 168 370 200" fill="none" stroke="#8FA09A" strokeWidth="10" strokeLinecap="round" />
<ellipse cx="324" cy="168" rx="5" ry="20" fill="#F2A33A" opacity=".85" />
<circle cx="371" cy="206" r="24" fill="#5B8FE0" opacity=".2" />
<circle cx="371" cy="206" r="11" fill="#5B8FE0" opacity=".45" />
</g>
</symbol>

<symbol id="br-rotary" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<ellipse cx="210" cy="258" rx="160" ry="12" fill="#12221F" opacity=".12" />
<rect x="64" y="146" width="128" height="106" rx="18" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<rect x="82" y="164" width="92" height="44" rx="7" fill="#12221F" />
<text x="128" y="186" textAnchor="middle" fontFamily="monospace" fontSize="15" fill="#7CE0C8">300 rpm</text>
<text x="128" y="201" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#7CE0C8" opacity=".7">2.0 N·cm</text>
<circle cx="98" cy="228" r="8" fill="#0D5C55" />
<circle cx="122" cy="228" r="8" fill="#FFFFFF" stroke="#C9D4CF" strokeWidth="2" />
<rect x="140" y="221" width="34" height="14" rx="7" fill="#DCE3DF" />
<g transform="rotate(-38 270 175)">
<rect x="196" y="160" width="130" height="32" rx="16" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<path d="M210 168h100" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity=".8" />
<circle cx="220" cy="176" r="5" fill="#0D5C55" />
<rect x="240" y="170" width="40" height="12" rx="6" fill="#DCE3DF" />
<path d="M324 166L358 170L358 182L324 186Z" fill="url(#br-steel)" stroke="#8FA09A" />
<circle cx="366" cy="176" r="11" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="2" />
<path d="M366 190V220" stroke="#5D6E69" strokeWidth="3" strokeLinecap="round" />
<rect x="361" y="186" width="10" height="6" rx="2" fill="#F2A33A" />
</g>
</symbol>

<symbol id="br-micro" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<ellipse cx="200" cy="258" rx="160" ry="12" fill="#12221F" opacity=".12" />
<path d="M246 152C266 172 264 204 238 214" fill="none" stroke="#3C4C48" strokeWidth="5" strokeLinecap="round" />
<rect x="196" y="120" width="30" height="20" rx="6" fill="#AEBDB7" />
<rect x="56" y="136" width="184" height="108" rx="16" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<circle cx="110" cy="190" r="38" fill="none" stroke="#C9D4CF" strokeWidth="4" strokeDasharray="3 7" />
<circle cx="110" cy="190" r="28" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="2" />
<circle cx="110" cy="190" r="18" fill="#F7FAF9" />
<path d="M110 190L96 176" stroke="#0D5C55" strokeWidth="4" strokeLinecap="round" />
<rect x="166" y="166" width="50" height="22" rx="11" fill="#DCE3DF" />
<circle cx="204" cy="177" r="8" fill="#0D5C55" />
<circle cx="176" cy="214" r="4" fill="#0D5C55" />
<circle cx="192" cy="214" r="4" fill="#F2A33A" />
<rect x="166" y="224" width="50" height="6" rx="3" fill="#DCE3DF" />
<g transform="rotate(-22 300 130)">
<rect x="240" y="116" width="120" height="30" rx="14" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="2" />
<g stroke="#8FA09A" strokeWidth="2">
<line x1="262" y1="119" x2="262" y2="143" />
<line x1="270" y1="119" x2="270" y2="143" />
<line x1="278" y1="119" x2="278" y2="143" />
<line x1="286" y1="119" x2="286" y2="143" />
</g>
<path d="M296 124h56" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity=".6" />
<rect x="358" y="122" width="20" height="18" rx="5" fill="#8FA09A" />
<path d="M378 131H396" stroke="#5D6E69" strokeWidth="3" strokeLinecap="round" />
</g>
</symbol>

<symbol id="br-iocam" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<ellipse cx="200" cy="256" rx="160" ry="11" fill="#12221F" opacity=".12" />
<rect x="145" y="196" width="20" height="36" fill="url(#br-steel)" />
<rect x="108" y="228" width="94" height="12" rx="6" fill="#5D6E69" />
<rect x="60" y="66" width="190" height="134" rx="14" fill="#12221F" stroke="#3C4C48" strokeWidth="6" />
<rect x="72" y="78" width="166" height="110" rx="6" fill="url(#br-glass)" />
<rect x="84" y="102" width="32" height="64" rx="14" fill="#F4F1E8" />
<rect x="122" y="98" width="34" height="68" rx="15" fill="#F7F4EC" />
<rect x="162" y="100" width="32" height="66" rx="14" fill="#F4F1E8" />
<rect x="200" y="106" width="30" height="60" rx="13" fill="#EDE9DE" />
<path d="M72 152q24 10 41 0q19 10 40 0q20 10 41 0q19 10 44 0v36H72z" fill="#C07B78" />
<g stroke="#7CE0C8" strokeWidth="2.5" fill="none" strokeLinecap="round">
<path d="M84 90h14M84 90v14" />
<path d="M226 90h-14M226 90v14" />
</g>
<circle cx="224" cy="176" r="4" fill="#E5534B" />
<path d="M246 232C226 250 196 252 172 236" fill="none" stroke="#3C4C48" strokeWidth="4" strokeLinecap="round" />
<g transform="rotate(-28 310 200)">
<rect x="240" y="188" width="140" height="26" rx="13" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<path d="M256 195h90" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity=".8" />
<rect x="354" y="190" width="30" height="22" rx="8" fill="#3C4C48" />
<circle cx="372" cy="201" r="5" fill="#7CE0C8" />
<rect x="282" y="184" width="24" height="7" rx="3.5" fill="#0D5C55" />
</g>
</symbol>

<symbol id="br-loupe" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#br-bg)" />
<ellipse cx="200" cy="252" rx="160" ry="11" fill="#12221F" opacity=".12" />
<path d="M222 106C282 100 334 160 330 214" fill="none" stroke="#3C4C48" strokeWidth="3" />
<rect x="300" y="212" width="62" height="36" rx="10" fill="#3C4C48" />
<circle cx="316" cy="230" r="4" fill="#7CE0C8" />
<rect x="328" y="226" width="24" height="8" rx="4" fill="#5D6E69" />
<path d="M102 166L58 154L50 184" fill="none" stroke="#3C4C48" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
<path d="M298 166L342 154L350 184" fill="none" stroke="#3C4C48" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
<circle cx="148" cy="168" r="46" fill="#E8F1EE" stroke="#3C4C48" strokeWidth="8" />
<circle cx="252" cy="168" r="46" fill="#E8F1EE" stroke="#3C4C48" strokeWidth="8" />
<path d="M194 162Q200 146 206 162" fill="none" stroke="#3C4C48" strokeWidth="8" strokeLinecap="round" />
<circle cx="148" cy="168" r="30" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="2" />
<circle cx="148" cy="168" r="19" fill="url(#br-glass)" />
<path d="M137 158a14 14 0 0 1 12-6" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity=".5" />
<circle cx="252" cy="168" r="30" fill="url(#br-steel)" stroke="#8FA09A" strokeWidth="2" />
<circle cx="252" cy="168" r="19" fill="url(#br-glass)" />
<path d="M241 158a14 14 0 0 1 12-6" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity=".5" />
<rect x="194" y="116" width="12" height="34" rx="4" fill="#8FA09A" />
<rect x="178" y="90" width="44" height="30" rx="10" fill="url(#br-body)" stroke="#AEBDB7" strokeWidth="2" />
<circle cx="200" cy="105" r="8" fill="#FFE7B0" stroke="#F2A33A" strokeWidth="2" />
</symbol>

    </svg>
  );
}
