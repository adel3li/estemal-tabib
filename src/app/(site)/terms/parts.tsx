// Building blocks for the terms tabs (visual language of Terms.dc.html).
import type { ReactNode } from "react";

export type Tone = { bg: string; fg: string; dot: string };
export const TONES = {
  teal: { bg: "#E2F4F8", fg: "#0A7E99", dot: "#0A7E99" },
  blue: { bg: "#E6EDF7", fg: "#24508F", dot: "#24508F" },
  amber: { bg: "#FEEEDB", fg: "#D0700A", dot: "#D0700A" },
  green: { bg: "#EAF5DD", fg: "#3F7A1F", dot: "#3F7A1F" },
} satisfies Record<string, Tone>;

const NUMS = "١٢٣٤٥٦٧٨٩";

export function Toc({ label, items }: { label: string; items: { id: string; title: string; tone: Tone }[] }) {
  return (
    <nav className="tm-toc" aria-label={label} style={{ padding: 18, borderRadius: 20, background: "#FFFFFF", border: "1px solid #DCE3E1", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ padding: "0 8px 6px", fontSize: 13, fontWeight: 700, color: "#4A595A" }}>المحتويات</span>
      {items.map((it, i) => (
        <a key={it.id} href={`#${it.id}`} style={{ padding: "8px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
          <span style={{ flex: "none", width: 26, height: 26, borderRadius: 8, background: it.tone.bg, color: it.tone.fg, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{NUMS[i]}</span>
          {it.title}
        </a>
      ))}
    </nav>
  );
}

export function Numbers({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <div style={{ padding: 18, borderRadius: 20, background: "#14243A", color: "#C3D3D3", display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>أرقام مهمة</span>
      {rows.map((r, i) => (
        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, ...(i < rows.length - 1 ? { paddingBottom: 8, borderBottom: "1px solid #2E4F56" } : {}) }}>
          <span style={{ fontSize: 14 }}>{r.label}</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#F7941D", whiteSpace: "nowrap", flex: "none" }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/** «بحد أدنى» after an amount, smaller. */
export const Min = () => <span style={{ fontSize: 13, fontWeight: 600 }}>بحد أدنى</span>;

export function Article({ id, n, title, tone, icon, children }: { id: string; n: number; title: string; tone: Tone; icon: ReactNode; children: ReactNode }) {
  return (
    <article id={id} className="tm-art" style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3E1", boxShadow: "0 10px 30px rgba(15,42,51, 0.06)", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ position: "relative", flex: "none", width: 52, height: 52, borderRadius: 16, background: tone.bg, color: tone.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
          <span aria-hidden="true" style={{ position: "absolute", top: -6, left: -6, width: 22, height: 22, borderRadius: 999, background: tone.dot, color: "#FFFFFF", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFFFFF" }}>{NUMS[n - 1]}</span>
        </span>
        <h2 className="tm-h2" style={{ margin: 0, lineHeight: 1.4 }}>
          {NUMS[n - 1]}. {title}
        </h2>
      </div>
      {children}
    </article>
  );
}

/** One clause: bold lead-in + text. */
export function Clause({ title, children }: { title: string; children: ReactNode }) {
  return (
    <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF9", border: "1px solid #E5EBEA" }}>
      <strong>{title}:</strong> {children}
    </p>
  );
}

/** Green "refunded" / amber "not refunded" box. */
export function Outcome({ kind, title, items }: { kind: "ok" | "no"; title: string; items: ReactNode[] }) {
  const ok = kind === "ok";
  return (
    <div style={{ padding: "16px 18px", borderRadius: 16, background: ok ? "#E2F4F8" : "#FEEEDB", border: `1px solid ${ok ? "#9ED8E6" : "#F8C788"}`, color: ok ? "#075468" : "#6B3A10" }}>
      <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ flex: "none", width: 26, height: 26, borderRadius: 999, background: ok ? "#0A7E99" : "#D0700A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            {ok ? <path d="M5 12l4 4 10-10" /> : <path d="M6 6l12 12M18 6L6 18" />}
          </svg>
        </span>
        {title}
      </div>
      <ul style={{ margin: "8px 0 0", paddingRight: 20, display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export const Num = ({ children }: { children: ReactNode }) => <span className="tm-num">{children}</span>;

export const Two = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 12 }}>{children}</div>
);

/** Clauses that apply to both sides (أولاً: أحكام عامة وتعريفات). */
export function GeneralClauses() {
  return (
    <>
      <Clause title="طبيعة المنصة">
        «استعمال طبيب» منصة وساطة وفحص تقني متخصصة في أجهزة ومعدات الأسنان المستعملة، وتعمل كطرف ثالث محايد يضمن سلامة المعاملة المالية والفنية بين الأطراف.
      </Clause>
      {/* Students confirmed by the client (docs/ADMIN_SPEC.md §7). */}
      <Clause title="أهلية الاستخدام">
        المنصة مخصصة لأطباء الأسنان وطلبة طب الأسنان والعيادات والمراكز الطبية. يُقر المستخدم بصحة بياناته وصفته عند التسجيل أو طلب أي خدمة.
      </Clause>
    </>
  );
}

export const ICONS = {
  scales: (
    <>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M5 7l-3 6a3 3 0 0 0 6 0z" />
      <path d="M19 7l-3 6a3 3 0 0 0 6 0z" />
      <path d="M8 21h8" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3h6v1" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  coins: (
    <>
      <circle cx="9" cy="9" r="6" />
      <path d="M15.5 9.5a6 6 0 1 1-6 6" />
      <path d="M9 6v6M7 8h3.5a1 1 0 0 1 0 2H8" />
    </>
  ),
  home: (
    <>
      <path d="M3 10l9-6 9 6v10H3z" />
      <path d="M8 20v-6h8v6" />
      <path d="M8 17h8" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
};
