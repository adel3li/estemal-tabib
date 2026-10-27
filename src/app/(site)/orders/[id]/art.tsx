// Autoclave illustration (from Order-Tracker.dc.html).
export function OtSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
<defs>
<linearGradient id="ot-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#DCE5E1" /></linearGradient>
<linearGradient id="ot-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E9EEEC" /><stop offset=".5" stopColor="#B9C6C1" /><stop offset="1" stopColor="#8FA09A" /></linearGradient>
<radialGradient id="ot-glass" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#5D7A74" /><stop offset="1" stopColor="#1D3330" /></radialGradient>
<linearGradient id="ot-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF4F1" /><stop offset="1" stopColor="#D6E3DE" /></linearGradient>
</defs>
<symbol id="ot-auto" viewBox="0 0 400 300">
<rect width="400" height="300" fill="url(#ot-bg)" />
<circle cx="330" cy="62" r="70" fill="#FFFFFF" opacity=".35" />
<ellipse cx="190" cy="262" rx="150" ry="12" fill="#12221F" opacity=".12" />
<rect x="54" y="74" width="272" height="182" rx="24" fill="url(#ot-body)" stroke="#AEBDB7" strokeWidth="2" />
<path d="M54 112h272" stroke="#C9D4CF" strokeWidth="2" />
<rect x="72" y="84" width="84" height="20" rx="6" fill="#12221F" />
<rect x="80" y="91" width="40" height="6" rx="3" fill="#7CE0C8" />
<circle cx="140" cy="94" r="4" fill="#F2A33A" />
<circle cx="286" cy="94" r="7" fill="#0D5C55" />
<circle cx="306" cy="94" r="7" fill="#FFFFFF" stroke="#C9D4CF" strokeWidth="2" />
<rect x="168" y="89" width="60" height="10" rx="5" fill="#DCE3DF" />
<circle cx="170" cy="184" r="60" fill="url(#ot-steel)" stroke="#8FA09A" strokeWidth="3" />
<circle cx="170" cy="184" r="44" fill="url(#ot-glass)" />
<path d="M146 162a32 32 0 0 1 28-14" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".45" />
<rect x="226" y="176" width="54" height="14" rx="7" fill="#8FA09A" />
<circle cx="230" cy="183" r="10" fill="url(#ot-steel)" stroke="#8FA09A" strokeWidth="2" />
<rect x="290" y="128" width="22" height="108" rx="7" fill="#EEF3F1" stroke="#C9D4CF" />
<g fill="#AEBDB7"><rect x="295" y="146" width="12" height="4" rx="2" /><rect x="295" y="156" width="12" height="4" rx="2" /><rect x="295" y="166" width="12" height="4" rx="2" /></g>
<rect x="78" y="252" width="28" height="10" rx="3" fill="#5D6E69" />
<rect x="274" y="252" width="28" height="10" rx="3" fill="#5D6E69" />
<g transform="rotate(8 332 160)">
<rect x="296" y="112" width="74" height="96" rx="10" fill="#FFFFFF" stroke="#C9D4CF" strokeWidth="2" />
<rect x="316" y="104" width="34" height="14" rx="5" fill="#C46A12" />
<rect x="308" y="132" width="50" height="5" rx="2.5" fill="#DCE3DF" />
<rect x="308" y="144" width="40" height="5" rx="2.5" fill="#DCE3DF" />
<rect x="308" y="156" width="46" height="5" rx="2.5" fill="#DCE3DF" />
<circle cx="333" cy="186" r="12" fill="#0D5C55" />
<path d="M327 186l4 4 8-8" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
</g>
</symbol>
    </svg>
  );
}

type IconProps = { size?: number; stroke?: string; width?: number };
const Ic = ({ size = 22, stroke = "currentColor", width = 1.8, children }: IconProps & { children: React.ReactNode }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
    {children}
  </svg>
);

/** One icon per canonical order step (§11), in order. */
export const STEP_ICONS: ((p: IconProps) => React.ReactElement)[] = [
  (p) => <Ic {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="M9 13l2 2 4-4" /></Ic>,
  (p) => <Ic {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Ic>,
  (p) => <Ic {...p}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></Ic>,
  (p) => <Ic {...p}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13l2 2 4-4" /></Ic>,
  (p) => <Ic {...p}><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></Ic>,
  (p) => <Ic {...p}><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-5h4v5" /></Ic>,
  (p) => <Ic {...p}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></Ic>,
];

export const CardIcon = (p: IconProps) => <Ic {...p}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><path d="M16 15h2" /></Ic>;
export const CheckIcon = ({ size = 11, width = 3.4 }: IconProps) => <Ic size={size} width={width}><path d="M5 12.5l4.5 4.5L19 7.5" /></Ic>;
export const DocIcon = () => <Ic size={18}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></Ic>;
export const ArrowIcon = () => <Ic size={18} width={2}><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></Ic>;
export const LockIcon = (p: IconProps) => <Ic {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Ic>;
export const RefreshIcon = () => <Ic size={20} stroke="#0D5C55"><path d="M4 12a8 8 0 0 1 14-5.3L20 9" /><path d="M20 4v5h-5" /><path d="M20 12a8 8 0 0 1-14 5.3L4 15" /><path d="M4 20v-5h5" /></Ic>;
export const ShieldIcon = () => <Ic size={20} stroke="#0D5C55"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></Ic>;
export const WrenchIcon = () => <Ic size={20} stroke="#0D5C55"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" /></Ic>;
export const HelpIcon = () => <Ic size={20} stroke="#0D5C55"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7" /><path d="M12 17h.01" /></Ic>;
export const WaIcon = () => <Ic size={20}><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" /></Ic>;
