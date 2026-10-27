// /devices filter state <-> URL query (shareable links, home-page deep links).
import type { Condition, Device, DeviceType } from "@/lib/demo/types";
import { DEVICE_TYPES, parseNum, typeLabel } from "@/lib/demo/labels";

export type St = "all" | "done" | "order";
export type Sort = "new" | "asc" | "desc";

export type Filters = {
  st: St;
  cat: DeviceType | "all";
  maint: "all" | "3" | "6";
  cond: Condition | "all";
  q: string;
  pmin: string;
  pmax: string;
  sort: Sort;
};

export const EMPTY: Filters = { st: "all", cat: "all", maint: "all", cond: "all", q: "", pmin: "", pmax: "", sort: "new" };

const oneOf = <T extends string>(v: string | null, allowed: readonly T[], fallback: T): T =>
  v !== null && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;

const TYPE_IDS = DEVICE_TYPES.map((t) => t.id);

type Readable = { get(name: string): string | null };

export function parseFilters(sp: Readable): Filters {
  return {
    st: oneOf(sp.get("st"), ["all", "done", "order"] as const, "all"),
    cat: oneOf<DeviceType | "all">(sp.get("cat"), ["all", ...TYPE_IDS], "all"),
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
