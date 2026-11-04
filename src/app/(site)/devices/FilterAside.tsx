import { useEffect, useRef, useState, type ReactNode } from "react";
import type { DeviceType } from "@/lib/demo/types";
import { useDeviceTypes } from "@/lib/categories";
import { categoryFields } from "@/lib/demo/labels";
import type { Filters } from "./filters";

type Opt<T extends string> = { id: T; label: string };

// Category options: Browse.dc.html's order for the built-ins (the client's
// priority groups first), then any category added from the dashboard.
const DESIGN_ORDER = ["cam", "rotary", "micro", "loupe", "cure", "unit", "xray", "autoclave", "surg", "apex", "contra", "iocam"];
export function catOpts(types: { id: DeviceType; label: string }[]): Opt<DeviceType | "all">[] {
  const rank = (id: string) => (id === "other" ? 9999 : DESIGN_ORDER.includes(id) ? DESIGN_ORDER.indexOf(id) : 500 + types.findIndex((t) => t.id === id));
  return [{ id: "all", label: "الكل" }, ...[...types].sort((x, y) => rank(x.id) - rank(y.id))];
}
const CAT_SHOW = 8;

const ST_OPTS: Opt<Filters["st"]>[] = [
  { id: "all", label: "الكل" },
  { id: "done", label: "تم الفحص" },
  { id: "order", label: "يُفحص عند الطلب" },
];
const MAINT_OPTS: Opt<Filters["maint"]>[] = [
  { id: "all", label: "الكل" },
  { id: "3", label: "3 شهور" },
  { id: "6", label: "6 شهور" },
];
const COND_OPTS: Opt<Filters["cond"]>[] = [
  { id: "all", label: "الكل" },
  { id: "a", label: "ممتازة 81–100%" },
  { id: "b", label: "جيدة 60–80%" },
  { id: "c", label: "أقل من 60%" },
];

/** Single-choice list (v2 «chk» rows). `count` = results if this option were picked. */
function OptList<T extends string>({ opts, value, onPick, count }: { opts: Opt<T>[]; value: T; onPick: (v: T) => void; count?: (v: T) => number }) {
  return (
    <div className="br-opts">
      {opts.map((o) => {
        const on = o.id === value;
        return (
          <button key={o.id} type="button" className="br-opt" aria-pressed={on} onClick={() => onPick(o.id)}>
            <i aria-hidden="true" />
            {o.label}
            {count ? <em className="hm-num">{count(o.id)}</em> : null}
          </button>
        );
      })}
    </div>
  );
}

function Seg<T extends string>({ opts, value, onPick }: { opts: Opt<T>[]; value: T; onPick: (v: T) => void }) {
  return (
    <div className="br-seg">
      {opts.map((o) => (
        <button key={o.id} type="button" aria-pressed={o.id === value} onClick={() => onPick(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Group({ label, children, aside }: { label: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="br-group">
      <span className="br-group-h">{label}{aside}</span>
      {children}
    </div>
  );
}

type Props = {
  f: Filters;
  set: (p: Partial<Filters>) => void;
  reset: () => void;
  /** Results for `f` with one field swapped — powers the counts next to each option. */
  countWith: (p: Partial<Filters>) => number;
  /** < 1024px the aside is a sheet: open/close + result count for its footer button. */
  open: boolean;
  onClose: () => void;
  count: number;
};

export function FilterAside({ f, set, reset, countWith, open, onClose, count }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [allCats, setAllCats] = useState(false);
  const CAT_OPTS = catOpts(useDeviceTypes());

  // Sheet behaviour (only while open, which only happens < 1024px): Esc closes,
  // page behind doesn't scroll, focus moves into the sheet.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement: html } = document;
    const prev = [body.style.overflow, html.style.overflow];
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => { if (mq.matches) onClose(); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      [body.style.overflow, html.style.overflow] = prev;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, onClose]);

  // Keep the picked type visible when the list is collapsed.
  const pickedHidden = CAT_OPTS.findIndex((o) => o.id === f.cat) >= CAT_SHOW;
  const cats = allCats || pickedHidden ? CAT_OPTS : CAT_OPTS.slice(0, CAT_SHOW);
  const more = CAT_OPTS.length - CAT_SHOW;

  return (
    <>
    {open ? <div className="br-backdrop" aria-hidden="true" onClick={onClose} /> : null}
    <aside
      id="br-filters"
      className={open ? "br-aside is-open" : "br-aside"}
      aria-label="تصفية النتائج"
      role={open ? "dialog" : undefined}
      aria-modal={open ? true : undefined}
    >
      <div className="br-aside-head">
        <span className="br-aside-title">تصفية</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button type="button" className="br-reset" onClick={reset}>مسح الكل</button>
          <button ref={closeRef} type="button" className="br-sheet-close" onClick={onClose} aria-label="إغلاق التصفية">
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>
          </button>
        </span>
      </div>

      <div className="br-aside-body">
        <Group label="حالة الفحص">
          <OptList opts={ST_OPTS} value={f.st} onPick={(st) => set({ st })} count={(st) => countWith({ st })} />
        </Group>
        <Group label="نوع الجهاز">
          <OptList opts={cats} value={f.cat} onPick={(cat) => set({ cat, spec: {} })} count={(cat) => countWith({ cat, spec: {} })} />
          {!pickedHidden ? (
            <button type="button" className="hm-tlink br-more-types" onClick={() => setAllCats((x) => !x)} aria-expanded={allCats}>
              {allCats ? "أنواع أقل" : `+ ${more} أنواع تانية`}
            </button>
          ) : null}
        </Group>
        {/* The chosen category's own «اختيار» details as filters (set in «الأنواع»). */}
        {f.cat !== "all"
          ? categoryFields(f.cat)
              .filter((x) => x.kind === "select" && (x.options ?? []).length)
              .map((x) => (
                <Group key={x.key} label={x.label}>
                  <OptList
                    opts={[{ id: "", label: "الكل" }, ...(x.options ?? []).map((o) => ({ id: o, label: o }))]}
                    value={f.spec[x.key] ?? ""}
                    onPick={(v) => set({ spec: { ...f.spec, [x.key]: v } })}
                    count={(v) => countWith({ spec: { ...f.spec, [x.key]: v } })}
                  />
                </Group>
              ))
          : null}
        <Group label="السعر (ج.م)">
          <div className="br-range">
            <label>
              <span>من</span>
              <input type="text" className="br-input" inputMode="numeric" value={f.pmin} onChange={(e) => set({ pmin: e.target.value })} placeholder="0" />
            </label>
            <label>
              <span>لحد</span>
              <input type="text" className="br-input" inputMode="numeric" value={f.pmax} onChange={(e) => set({ pmax: e.target.value })} placeholder="أي سعر" />
            </label>
          </div>
        </Group>
        <Group label="حالة المنتج">
          <OptList opts={COND_OPTS} value={f.cond} onPick={(cond) => set({ cond })} count={(cond) => countWith({ cond })} />
        </Group>
        <Group label="مدة الضمان">
          <Seg opts={MAINT_OPTS} value={f.maint} onPick={(maint) => set({ maint })} />
        </Group>
      </div>

      <div className="br-sheet-foot">
        <button type="button" className="br-sheet-apply" onClick={onClose}>
          اعرض النتائج ({count})
        </button>
      </div>
    </aside>
    </>
  );
}

export const FILTER_LABELS = { ST_OPTS, MAINT_OPTS, COND_OPTS };
