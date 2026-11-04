// /devices filter state <-> URL query (shareable links, home-page deep links).
import type { Condition, Device, DeviceType } from "@/lib/demo/types";
import { parseNum, typeLabel } from "@/lib/demo/labels";

export type St = "all" | "done" | "order";
export type Sort = "new" | "asc" | "desc";

export type Filters = {
  st: St;
  cat: DeviceType | "all";
  /** The chosen category's detail filters (e.g. memory = 256 GB), URL `s_<key>=…`. */
  spec: Record<string, string>;
  maint: "all" | "3" | "6";
  cond: Condition | "all";
  q: string;
  pmin: string;
  pmax: string;
  sort: Sort;
};

export const EMPTY: Filters = { st: "all", cat: "all", spec: {}, maint: "all", cond: "all", q: "", pmin: "", pmax: "", sort: "new" };

const oneOf = <T extends string>(v: string | null, allowed: readonly T[], fallback: T): T =>
  v !== null && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;

// Any category id (they are added from the dashboard), not only the built-ins.
const catOf = (v: string | null): DeviceType | "all" => (v && /^[a-z0-9_]{2,40}$/.test(v) ? v : "all");

type Readable = { get(name: string): string | null; forEach?: (cb: (value: string, key: string) => void) => void };

function specsOf(sp: Readable): Record<string, string> {
  const out: Record<string, string> = {};
  sp.forEach?.((v, k) => {
    if (k.startsWith("s_") && v) out[k.slice(2)] = v;
  });
  return out;
}

export function parseFilters(sp: Readable): Filters {
  return {
    st: oneOf(sp.get("st"), ["all", "done", "order"] as const, "all"),
    cat: catOf(sp.get("cat")),
    spec: specsOf(sp),
    maint: oneOf(sp.get("maint"), ["all", "3", "6"] as const, "all"),
    cond: oneOf<Condition | "all">(sp.get("cond"), ["all", "a", "b", "c"], "all"),
    q: sp.get("q") ?? "",
    pmin: sp.get("pmin") ?? "",
    pmax: sp.get("pmax") ?? "",
    sort: oneOf(sp.get("sort"), ["new", "asc", "desc"] as const, "new"),
  };
}

/** Canonical query string (defaults left out). */
export function serializeFilters(f: Filters): string {
  const p = new URLSearchParams();
  if (f.st !== "all") p.set("st", f.st);
  if (f.cat !== "all") p.set("cat", f.cat);
  if (f.cat !== "all") Object.entries(f.spec).forEach(([k, v]) => v && p.set(`s_${k}`, v));
  if (f.maint !== "all") p.set("maint", f.maint);
  if (f.cond !== "all") p.set("cond", f.cond);
  if (f.q) p.set("q", f.q);
  if (f.pmin) p.set("pmin", f.pmin);
  if (f.pmax) p.set("pmax", f.pmax);
  if (f.sort !== "new") p.set("sort", f.sort);
  return p.toString();
}

export function applyFilters(devices: Device[], f: Filters): Device[] {
  const pmin = parseNum(f.pmin);
  const pmax = parseNum(f.pmax);
  const q = f.q.trim();
  const out = devices.filter((d) => {
    if (f.st === "done" && d.inspection !== "inspected") return false;
    if (f.st === "order" && d.inspection !== "on_order") return false;
    if (f.cat !== "all" && d.type !== f.cat) return false;
    if (f.cat !== "all" && Object.entries(f.spec).some(([k, v]) => v && d.specs?.[k] !== v)) return false;
    if (f.maint !== "all" && String(d.maintenanceMonths) !== f.maint) return false;
    if (f.cond !== "all" && d.condition !== f.cond) return false;
    if (pmin && d.price < pmin) return false;
    if (pmax && d.price > pmax) return false;
    if (q && !d.title.includes(q) && !typeLabel(d.type).includes(q)) return false;
    return true;
  });
  if (f.sort === "asc") out.sort((a, b) => a.price - b.price);
  if (f.sort === "desc") out.sort((a, b) => b.price - a.price);
  return out;
}
