// Small building blocks shared by the /sell sections.
import type { CSSProperties, ReactNode } from "react";
import type { Errors, FieldKey, SellForm } from "./form";
import { fieldId } from "./form";

export type SectionProps = {
  f: SellForm;
  set: (patch: Partial<SellForm>) => void;
  err: Errors;
};

export const Star = () => (
  <span aria-hidden="true" style={{ color: "#B3261E", marginRight: 4 }}>
    *
  </span>
);

/** Short red message under a field. */
export function Msg({ k, err }: { k: FieldKey; err: Errors }) {
  const m = err[k];
  if (!m) return null;
  return (
    <span id={`${fieldId(k)}-msg`} className="sl-msg" role="alert">
      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6" />
        <path d="M12 16.5v.5" />
      </svg>
      {m}
    </span>
  );
}

/** Props for an input/select/textarea bound to an error key. */
export function bad(k: FieldKey, err: Errors, cls = "sl-in") {
  const has = !!err[k];
  return {
    id: fieldId(k),
    className: has ? `${cls} sl-bad` : cls,
    "aria-invalid": has || undefined,
    "aria-describedby": has ? `${fieldId(k)}-msg` : undefined,
  };
}

export function CardHead({
  icon,
  iconBg,
  iconFg,
  step,
  stepFg,
  title,
  extra,
}: {
  icon: ReactNode;
  iconBg: string;
  iconFg: string;
  step: string;
  stepFg: string;
  title: string;
  extra?: ReactNode;
}) {
  return (
    <legend className="sl-legend">
      <span style={{ width: 48, height: 48, borderRadius: 15, background: iconBg, color: iconFg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </span>
      <span style={{ flex: extra ? 1 : undefined, display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: stepFg }}>{step}</span>
        <span style={{ fontWeight: 700, fontSize: 21, color: "#12221F" }}>{title}</span>
      </span>
      {extra}
    </legend>
  );
}

export const grid = (min: number, gap = 16): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))`,
  gap,
});

export const radioStyle = (size: number, margin: string | number = 0): CSSProperties => ({
  width: size,
  height: size,
  margin,
  accentColor: "#0D5C55",
  flex: "none",
});

export const subLegend: CSSProperties = { padding: "0 6px", fontWeight: 600, fontSize: 14, color: "#24332F" };
