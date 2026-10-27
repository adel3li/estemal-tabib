// Small building blocks shared by the form sections (Admin.dc.html).
import type { ReactNode } from "react";

export const Req = () => (
  <span aria-hidden="true" style={{ color: "#B3261E", marginRight: 4 }}>
    *
  </span>
);

export function SectionHead({ id, n, bg, fg, children }: { id: string; n: ReactNode; bg: string; fg: string; children: ReactNode }) {
  return (
    <h2 className="ad-h" id={id}>
      <span className="ad-n" style={{ background: bg, color: fg }}>
        {n}
      </span>
      {children}
    </h2>
  );
}

export function Chips<T extends string>({
  label,
  value,
  options,
  onPick,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onPick: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontWeight: 600, fontSize: 14 }}>
        {label}
        <Req />
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} role="group" aria-label={label}>
        {options.map(([v, l]) => {
          const on = value === v;
          return (
            <button
              key={v}
              type="button"
              className="ad-chip"
              onClick={() => onPick(v)}
              aria-pressed={on}
              style={{ border: `1px solid ${on ? "#0D5C55" : "#C9D4CF"}`, background: on ? "#0D5C55" : "#FFFFFF", color: on ? "#FFFFFF" : "#12221F" }}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Dashed «drop» button that opens a hidden file input. Files stay in memory (demo). */
export function DropButton({
  icon,
  iconBg,
  title,
  hint,
  required,
  accept,
  multiple,
  status,
  onFiles,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  hint: string;
  required?: boolean;
  accept: string;
  multiple?: boolean;
  status?: string;
  onFiles: (files: File[]) => void;
}) {
  return (
    <label className="ad-drop">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden" }}
        onChange={(e) => {
          const list = Array.from(e.target.files ?? []);
          if (list.length) onFiles(list);
          e.target.value = "";
        }}
      />
      <span style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 700 }}>
          {title}
          {required ? <Req /> : null}
        </span>
        <span className="ad-hint">{hint}</span>
        {status ? <span style={{ fontSize: 13, fontWeight: 600, color: "#0D5C55" }}>{status}</span> : null}
      </span>
    </label>
  );
}
