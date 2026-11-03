"use client";

// Data store shared by every page (public site + admin). Everything comes
// from Supabase — RLS decides what each user sees:
//   DEVICES (everyone; admins also drafts + private data), FAVORITES (the
//   signed-in user's), and for admins: SUBMISSIONS (sell requests), REQUESTS
//   («اطلب جهاز») and INSPECTIONS.
// Admin actions change the state here; sync effects write whatever differs
// from the last copy known to be in the database.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BUSINESS } from "@/config/business";
import { useAuth } from "@/lib/auth/AuthProvider";
import { loginHref } from "@/lib/auth/next";
import { fetchDevices, fetchFavorites, saveDevice, setFavorite } from "@/lib/devices/db";
import { dateLabelOf, dayIndex, fetchInspections, inspectionRow, saveInspection } from "@/lib/inspections/db";
import { fetchRequests, requestRow, saveRequest } from "@/lib/requests/db";
import { fetchSubmissions, saveSubmission, setTrust as setTrustDb, whenAr, workflowRow } from "@/lib/submissions/db";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SUPABASE_URL } from "@/lib/supabase/env";
import { CORE_CHECKS } from "./seed";
import type {
  DemoState,
  Device,
  DeviceRequest,
  Inspection,
  InspectionReport,
  LogLine,
  Submission,
} from "./types";

const EMPTY: DemoState = { version: 1, devices: [], favorites: [], submissions: [], requests: [], inspections: [] };

/** Next code after the highest existing one: L-215 → L-216, #1024 → #1025. */
function nextCode(existing: string[], prefix: string, start: number): string {
  const nums = existing
    .map((id) => parseInt(id.replace(/[^0-9]/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  return `${prefix}${Math.max(start - 1, ...nums) + 1}`;
}

/** A log line stamped now (display text + ISO for the database). */
const stamp = (log: Omit<LogLine, "at">): LogLine => {
  const iso = new Date().toISOString();
  return { ...log, iso, at: whenAr(iso) };
};

/** «3 نوفمبر 2026» */
const todayAr = () => new Date().toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Cairo" });

export type NewInspection = Omit<Inspection, "id" | "status" | "form" | "day" | "dateLabel"> & { scheduledAt: string };

export type DemoApi = {
  /** false until the database data for the current user has loaded. */
  ready: boolean;
  /** Device load failed (offline / Supabase down). */
  devicesError: boolean;
  state: DemoState;
  getDevice: (id: string) => Device | undefined;
  addDevice: (d: Omit<Device, "id" | "views" | "createdAt">) => string;
  updateDevice: (id: string, patch: Partial<Device>) => void;
  /** Sell requests / requests / inspections failed to load (admins). */
  submissionsError: boolean;
  updateSubmission: (id: string, patch: Partial<Submission>, log?: Omit<LogLine, "at">) => void;
  /** Accept a sell request → creates a draft device from it. Returns the device id. */
  acceptSubmission: (id: string) => string;
  /** Flag a seller account جاد / مشبوه (null = no flag). Applies to all their requests. */
  setSellerTrust: (sellerId: string, trust: Submission["sellerTrust"]) => Promise<void>;
  updateRequest: (id: string, patch: Partial<DeviceRequest>) => void;
  /** Schedule a new inspection (e.g. from «حدد ميعاد فحص»). Returns its id. */
  addInspection: (i: NewInspection) => string;
  updateInspection: (id: string, patch: Partial<Inspection>) => void;
  /** «اعتمد ونشّر»: marks the inspection done, writes the report to the device,
   *  and publishes it for pre-publish inspections. Returns the device id. */
  approveInspection: (id: string) => string;
  /** Save / unsave a device (signed-in users; others are sent to /login). */
  toggleFavorite: (deviceId: string) => void;
  /** Published devices that match a buyer request (ADMIN_SPEC §6, open point C). */
  matchesFor: (r: DeviceRequest) => Device[];
};

const DemoContext = createContext<DemoApi | null>(null);

/**
 * «Similar» device for a request (ADMIN_SPEC open point C): same type,
 * published, price ≥ the minimum and ≤ the maximum + 20%; inspected-only
 * requests match inspected devices only.
 */
export function deviceMatches(d: Device, r: Pick<DeviceRequest, "deviceType" | "budgetMin" | "budgetMax" | "inspectionPref">): boolean {
  return (
    d.status === "published" &&
    d.type === r.deviceType &&
    (!r.budgetMin || d.price >= r.budgetMin) &&
    (!r.budgetMax || d.price <= r.budgetMax * (1 + BUSINESS.requestBudgetSlack)) &&
    (r.inspectionPref === "any" || d.inspection === "inspected")
  );
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(EMPTY);
  // Which user the database data was loaded for («user:isAdmin») — ready only when it's the current one.
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [devicesError, setDevicesError] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(false);
  const auth = useAuth();
  // Last copy known to match the database (by public code) — the sync effects
  // write only what differs from it.
  const synced = useRef<Map<string, Device>>(new Map());
  const syncedSubs = useRef<Map<string, string>>(new Map());
  const syncedReqs = useRef<Map<string, string>>(new Map());
  const syncedInsp = useRef<Map<string, string>>(new Map());
  // Source of truth for actions: lets an action return the new id right away
  // and lets two actions in one click see each other's result.
  const ref = useRef<DemoState>(EMPTY);
  const commit = useCallback((fn: (s: DemoState) => DemoState) => {
    ref.current = fn(ref.current);
    setState(ref.current);
  }, []);

  const { ready: authReady, userId, isAdmin, isTeam } = auth;
  const loadKey = authReady ? `${userId ?? "anon"}:${isAdmin}:${isTeam}` : null;
  const ready = loadKey !== null && loadedFor === loadKey;
  const devicesReady = ready;

  // Load everything for this user; reloaded when the signed-in user changes.
  useEffect(() => {
    if (!loadKey) return;
    if (!SUPABASE_URL) {
      void Promise.resolve().then(() => setLoadedFor(loadKey));
      return;
    }
    let alive = true;
    const sb = supabaseBrowser();
    const adminOnly = <T,>(fn: () => Promise<T[]>) =>
      isAdmin
        ? fn().catch((e) => {
            console.error("admin data load failed", e);
            if (alive) setSubmissionsError(true);
            return [] as T[];
          })
        : Promise.resolve([] as T[]);
    Promise.all([
      fetchDevices(sb),
      userId ? fetchFavorites(sb, userId) : Promise.resolve([] as string[]),
      adminOnly(() => fetchSubmissions(sb)),
      // The marketing team sees «اطلب جهاز» requests too (ADMIN_SPEC §1).
      isTeam ? fetchRequests(sb).catch((e) => { console.error(e); if (alive) setSubmissionsError(true); return []; }) : Promise.resolve([]),
      adminOnly(() => fetchInspections(sb)),
    ])
      .then(([devices, favorites, submissions, requests, inspections]) => {
        if (!alive) return;
        synced.current = new Map(devices.map((d) => [d.id, d]));
        const devIds = new Map(devices.map((d) => [d.id, d.dbId]));
        const subIds = new Map(submissions.map((x) => [x.id, x.dbId]));
        syncedSubs.current = new Map(submissions.map((x) => [x.id, JSON.stringify(workflowRow(x, x.deviceId ? devIds.get(x.deviceId) : undefined))]));
        syncedReqs.current = new Map(requests.map((r) => [r.id, JSON.stringify(requestRow(r))]));
        syncedInsp.current = new Map(
          inspections.map((i) => [
            i.id,
            JSON.stringify(inspectionRow(i, { deviceDbId: i.deviceId ? devIds.get(i.deviceId) : undefined, submissionDbId: i.submissionId ? subIds.get(i.submissionId) : undefined, orderDbId: i.orderDbId })),
          ]),
        );
        ref.current = { ...ref.current, devices, favorites, submissions, requests, inspections };
        setState(ref.current);
        setDevicesError(false);
        setLoadedFor(loadKey);
      })
      .catch((e) => {
        console.error("devices load failed", e);
        if (alive) {
          setDevicesError(true);
          setLoadedFor(loadKey);
        }
      });
    return () => {
      alive = false;
    };
  }, [loadKey, userId, isAdmin, isTeam]);

  // Admin changes → database. Compares with the last synced copy, so every
  // action (add/edit, accept submission, approve inspection) is covered.
  useEffect(() => {
    if (!isAdmin || !devicesReady) return;
    const sb = supabaseBrowser();
    for (const raw of state.devices) {
      // Link to the sell request's database row (the admin picks it by code).
      const subDbId = raw.submissionId ? ref.current.submissions.find((x) => x.id === raw.submissionId)?.dbId : undefined;
      const d = raw.submissionDbId === subDbId ? raw : { ...raw, submissionDbId: subDbId };
      const prev = synced.current.get(d.id);
      if (prev && JSON.stringify(prev) === JSON.stringify(d)) continue;
      synced.current.set(d.id, d); // optimistic: don't send the same change twice
      saveDevice(sb, prev, d)
        .then((dbId) => {
          if (d.dbId === dbId) return;
          const withId = { ...d, dbId };
          synced.current.set(d.id, withId);
          ref.current = { ...ref.current, devices: ref.current.devices.map((x) => (x.id === d.id ? { ...x, dbId } : x)) };
          setState(ref.current);
        })
        .catch((e) => {
          console.error("device save failed", d.id, e);
          if (prev) synced.current.set(d.id, prev);
          else synced.current.delete(d.id);
          window.alert(`ما قدرناش نحفظ ${d.id} في قاعدة البيانات. جرّب تاني.`);
        });
    }
  }, [state.devices, isAdmin, devicesReady]);

  // Sell requests → database. Re-runs when devices change too: a just-accepted
  // request gets its device_id once the draft is saved.
  useEffect(() => {
    if (!isAdmin || !devicesReady) return;
    const sb = supabaseBrowser();
    for (const x of state.submissions) {
      if (!x.dbId) continue;
      const deviceDbId = x.deviceId ? state.devices.find((d) => d.id === x.deviceId)?.dbId : undefined;
      if (x.deviceId && !deviceDbId) continue; // wait for the draft device's id
      const row = workflowRow(x, deviceDbId);
      const json = JSON.stringify(row);
      const prev = syncedSubs.current.get(x.id);
      if (prev === json) continue;
      syncedSubs.current.set(x.id, json);
      saveSubmission(sb, x.dbId, row).catch((e) => {
        console.error("submission save failed", x.id, e);
        if (prev === undefined) syncedSubs.current.delete(x.id);
        else syncedSubs.current.set(x.id, prev);
        window.alert(`ما قدرناش نحفظ طلب ${x.id} في قاعدة البيانات. جرّب تاني.`);
      });
    }
  }, [state.submissions, state.devices, isAdmin, devicesReady]);

  // «اطلب جهاز» status changes → database (admin or marketing).
  useEffect(() => {
    if (!isTeam || !devicesReady) return;
    const sb = supabaseBrowser();
    for (const r of state.requests) {
      if (!r.dbId) continue;
      const row = requestRow(r);
      const json = JSON.stringify(row);
      const prev = syncedReqs.current.get(r.id);
      if (prev === json) continue;
      syncedReqs.current.set(r.id, json);
      saveRequest(sb, r.dbId, row).catch((e) => {
        console.error("request save failed", r.id, e);
        if (prev === undefined) syncedReqs.current.delete(r.id);
        else syncedReqs.current.set(r.id, prev);
        window.alert(`ما قدرناش نحفظ طلب ${r.id} في قاعدة البيانات. جرّب تاني.`);
      });
    }
  }, [state.requests, isTeam, devicesReady]);

  // Inspections → database (new ones are inserted). Waits for linked rows'
  // ids (a draft device created in the same click).
  useEffect(() => {
    if (!isAdmin || !devicesReady) return;
    const sb = supabaseBrowser();
    for (const i of state.inspections) {
      const deviceDbId = i.deviceId ? state.devices.find((d) => d.id === i.deviceId)?.dbId : undefined;
      if (i.deviceId && !deviceDbId) continue;
      const submissionDbId = i.submissionId ? state.submissions.find((x) => x.id === i.submissionId)?.dbId : undefined;
      const row = inspectionRow(i, { deviceDbId, submissionDbId, orderDbId: i.orderDbId });
      const json = JSON.stringify(row);
      const prev = syncedInsp.current.get(i.id);
      if (prev === json) continue;
      syncedInsp.current.set(i.id, json);
      saveInspection(sb, i.dbId, row, userId ?? undefined)
        .then((dbId) => {
          if (i.dbId === dbId) return;
          ref.current = { ...ref.current, inspections: ref.current.inspections.map((x) => (x.id === i.id ? { ...x, dbId } : x)) };
          setState(ref.current);
        })
        .catch((e) => {
          console.error("inspection save failed", i.id, e);
          if (prev === undefined) syncedInsp.current.delete(i.id);
          else syncedInsp.current.set(i.id, prev);
          window.alert(`ما قدرناش نحفظ الفحص ${i.id} في قاعدة البيانات. جرّب تاني.`);
        });
    }
  }, [state.inspections, state.devices, state.submissions, isAdmin, devicesReady, userId]);

  const getDevice = useCallback((id: string) => state.devices.find((d) => d.id === decodeURIComponent(id)), [state.devices]);

  const addDevice: DemoApi["addDevice"] = useCallback((d) => {
    let id = "";
    commit((s) => {
      id = nextCode(s.devices.map((x) => x.id), "L-", 201);
      const device: Device = { ...d, id, views: 0, createdAt: todayAr() };
      return { ...s, devices: [device, ...s.devices] };
    });
    return id;
  }, [commit]);

  const updateDevice: DemoApi["updateDevice"] = useCallback((id, patch) => {
    commit((s) => ({ ...s, devices: s.devices.map((d) => (d.id === id ? { ...d, ...patch } : d)) }));
  }, [commit]);

  const updateSubmission: DemoApi["updateSubmission"] = useCallback((id, patch, log) => {
    commit((s) => ({
      ...s,
      submissions: s.submissions.map((x) =>
        x.id === id ? { ...x, ...patch, log: log ? [...x.log, stamp(log)] : x.log } : x,
      ),
    }));
  }, [commit]);

  const acceptSubmission: DemoApi["acceptSubmission"] = useCallback((subId) => {
    let deviceId = "";
    commit((s) => {
      const x = s.submissions.find((y) => y.id === subId);
      if (!x) return s;
      if (x.deviceId) {
        deviceId = x.deviceId;
        return s;
      }
      deviceId = nextCode(s.devices.map((d) => d.id), "L-", 201);
      const device: Device = {
        id: deviceId,
        title: x.details,
        type: x.deviceType,
        brand: x.brand,
        model: "[الموديل]",
        year: x.year || "[السنة]",
        origin: "[البلد]",
        governorate: x.governorate,
        price: x.salePrice,
        condition: x.condition,
        inspection: "on_order",
        maintenanceMonths: 3,
        status: "draft",
        featured: false,
        views: 0,
        source: "seller",
        createdAt: todayAr(),
        accessories: x.accessories,
        declaredDefects: x.defects,
        hasBox: x.hasBox,
        repairedBefore: x.repairedBefore,
        sellerNet: x.sellerNet,
        saleReason: x.saleReason,
        locationNow: x.keepLocation === "send_to_platform" ? "مقر الفحص" : "عند البايع",
        submissionId: x.id,
        submissionDbId: x.dbId,
      };
      return {
        ...s,
        devices: [device, ...s.devices],
        submissions: s.submissions.map((y) =>
          y.id === subId
            ? {
                ...y,
                status: "accepted",
                deviceId,
                log: [...y.log, stamp({ text: `اتقبل واتحول لإعلان مسودة (${deviceId})`, tone: "ok" })],
              }
            : y,
        ),
      };
    });
    return deviceId;
  }, [commit]);

  const setSellerTrust: DemoApi["setSellerTrust"] = useCallback(async (sellerId, trust) => {
    await setTrustDb(supabaseBrowser(), sellerId, trust ?? null);
    commit((s) => ({ ...s, submissions: s.submissions.map((x) => (x.sellerId === sellerId ? { ...x, sellerTrust: trust ?? null } : x)) }));
  }, [commit]);

  const updateRequest: DemoApi["updateRequest"] = useCallback((id, patch) => {
    commit((s) => ({ ...s, requests: s.requests.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }, [commit]);

  const addInspection: DemoApi["addInspection"] = useCallback((input) => {
    let id = "";
    commit((s) => {
      id = nextCode(s.inspections.map((x) => x.id), "F-", 301);
      const insp: Inspection = {
        ...input,
        id,
        day: dayIndex(input.scheduledAt),
        dateLabel: dateLabelOf(input.scheduledAt),
        status: "scheduled",
        form: {
          checks: { run: { v: "", n: "" }, look: { v: "", n: "" }, parts: { v: "", n: "" }, maint: { v: "", n: "" } },
          efficiency: "",
          condition: "",
          defects: "",
          photos: 0,
        },
      };
      return { ...s, inspections: [insp, ...s.inspections] };
    });
    return id;
  }, [commit]);

  const updateInspection: DemoApi["updateInspection"] = useCallback((id, patch) => {
    commit((s) => ({ ...s, inspections: s.inspections.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  }, [commit]);

  const approveInspection: DemoApi["approveInspection"] = useCallback((inspId) => {
    let deviceId = "";
    commit((s) => {
      const insp = s.inspections.find((x) => x.id === inspId);
      if (!insp) return s;
      const f = insp.form;
      const report: InspectionReport = {
        no: insp.id,
        date: todayAr(),
        serial: "[S/N]",
        technician: insp.technician || "[اسم الفني]",
        efficiency: f.efficiency || "—",
        appearance: f.checks.look.v === "note" ? "فيه ملاحظة" : "سليمة",
        replacedParts: f.checks.parts.n || "مفيش",
        checklist: CORE_CHECKS.map(({ key, label }) => ({
          label,
          result: f.checks[key].v === "note" ? "note" : "pass",
          note: f.checks[key].n || undefined,
        })),
        defects: f.defects && f.defects !== "مفيش" ? [f.defects] : [],
      };
      const publish = insp.kind === "pre_publish";
      let devices = s.devices;
      if (insp.deviceId && s.devices.some((d) => d.id === insp.deviceId)) {
        deviceId = insp.deviceId;
        devices = s.devices.map((d) =>
          d.id === deviceId
            ? {
                ...d,
                inspection: "inspected",
                report,
                condition: f.condition || d.condition,
                status: publish && (d.status === "draft" || d.status === "hidden") ? "published" : d.status,
              }
            : d,
        );
      } else {
        deviceId = nextCode(s.devices.map((d) => d.id), "L-", 201);
        devices = [
          {
            id: deviceId,
            title: insp.title,
            type: insp.deviceType,
            brand: "[الماركة]",
            model: "[الموديل]",
            year: "[السنة]",
            origin: "[البلد]",
            governorate: insp.governorate,
            price: 0,
            condition: f.condition || "b",
            inspection: "inspected",
            maintenanceMonths: 3,
            status: publish ? "draft" : "published",
            featured: false,
            views: 0,
            source: "seller",
            createdAt: todayAr(),
            accessories: "",
            declaredDefects: f.defects,
            report,
            internalNotes: "اتعمل من تقرير فحص — حط السعر قبل النشر.",
          },
          ...s.devices,
        ];
      }
      return {
        ...s,
        devices,
        inspections: s.inspections.map((x) => (x.id === inspId ? { ...x, status: "done", deviceId } : x)),
      };
    });
    return deviceId;
  }, [commit]);

  const toggleFavorite: DemoApi["toggleFavorite"] = useCallback((deviceId) => {
    if (!userId) {
      window.location.assign(loginHref(window.location.pathname + window.location.search));
      return;
    }
    const d = ref.current.devices.find((x) => x.id === deviceId);
    if (!d?.dbId) return;
    const on = !ref.current.favorites.includes(deviceId);
    const apply = (want: boolean) =>
      commit((s) => ({
        ...s,
        favorites: want ? [...s.favorites.filter((x) => x !== deviceId), deviceId] : s.favorites.filter((x) => x !== deviceId),
      }));
    apply(on);
    setFavorite(supabaseBrowser(), userId, d.dbId, on).catch((e) => {
      console.error("favorite failed", e);
      apply(!on);
    });
  }, [commit, userId]);

  const matchesFor: DemoApi["matchesFor"] = useCallback((r) => state.devices.filter((d) => deviceMatches(d, r)), [state.devices]);

  const api = useMemo<DemoApi>(
    () => ({
      ready,
      devicesError,
      submissionsError,
      state,
      getDevice,
      addDevice,
      updateDevice,
      updateSubmission,
      acceptSubmission,
      setSellerTrust,
      updateRequest,
      addInspection,
      updateInspection,
      approveInspection,
      toggleFavorite,
      matchesFor,
    }),
    [ready, devicesError, submissionsError, state, getDevice, addDevice, updateDevice, updateSubmission, acceptSubmission, setSellerTrust, updateRequest, addInspection, updateInspection, approveInspection, toggleFavorite, matchesFor],
  );

  return <DemoContext.Provider value={api}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoApi {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}

/** Devices a buyer can see in «كل الأجهزة». */
export const isListed = (d: Device) => d.status === "published";
/** Devices whose page is publicly reachable (§7 RLS: published / reserved / sold). */
export const isPublic = (d: Device) =>
  d.status === "published" || d.status === "reserved" || (d.status === "sold" && (!d.archiveAt || Date.parse(d.archiveAt) > Date.now()));

