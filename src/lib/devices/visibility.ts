// Who sees a listing (plain functions — usable on the server and in the browser).
import type { Device } from "@/lib/demo/types";

/** Devices a buyer can see in «كل الأجهزة». */
export const isListed = (d: Device) => d.status === "published";
/** Devices whose page is publicly reachable (§7 RLS: published / reserved / sold). */
export const isPublic = (d: Device) =>
  d.status === "published" || d.status === "reserved" || (d.status === "sold" && (!d.archiveAt || Date.parse(d.archiveAt) > Date.now()));
