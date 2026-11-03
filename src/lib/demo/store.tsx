"use client";

// Data store shared by every page (public site + admin).
// DEVICES come from Supabase (Step 4): loaded on start (RLS decides what each
// user sees) and every device change an admin makes — add, edit, publish,
// accept a submission, approve an inspection — is written back (see the sync
// effect). FAVORITES are the signed-in user's rows in `favorites`.
// SUBMISSIONS (sell requests) come from Supabase for admins (control panel
// step 2) and admin changes are written back the same way.
// Everything else (requests, inspections) is still demo data in localStorage.

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
import { useAuth } from "@/lib/auth/AuthProvider";
import { loginHref } from "@/lib/auth/next";
import { fetchDevices, fetchFavorites, saveDevice, setFavorite } from "@/lib/devices/db";
import { fetchSubmissions, saveSubmission, setTrust as setTrustDb, workflowRow } from "@/lib/submissions/db";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SUPABASE_URL } from "@/lib/supabase/env";
import { whenAr } from "@/lib/submissions/db";
import { CORE_CHECKS, DEMO_VERSION, SEED as DEMO_SEED } from "./seed";
import type {
  DemoState,
  Device,
  DeviceRequest,
  Inspection,
  InspectionReport,
  LogLine,
  Submission,
} from "./types";

const STORAGE_KEY = "istimal-tabib-demo";

// Devices, favorites and submissions aren't demo data any more: start empty, fill from the database.
const DB_EMPTY = { devices: [], favorites: [], submissions: [] };
const SEED: DemoState = { ...DEMO_SEED, ...DB_EMPTY };

function load(): DemoState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoState;
    return parsed.version === DEMO_VERSION ? { ...parsed, ...DB_EMPTY } : null;
  } catch {
    return null;
  }
}

function save(state: DemoState) {
  try {
    // Devices/favorites/submissions live in the database — don't keep stale copies here.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...DB_EMPTY }));
  } catch {
    /* storage full / blocked — the demo still works in memory */
  }
}

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

// `id`: the public code the database gave the row, so the demo admin shows the same number.
type NewRequest = Omit<DeviceRequest, "id" | "createdAt" | "status" | "notifiedAt"> & Partial<Pick<DeviceRequest, "id">>;

export type DemoApi = {
  /** false until localStorage AND the devices from the database have been read. */
  ready: boolean;
  /** Device load failed (offline / Supabase down). */
  devicesError: boolean;
  state: DemoState;
  getDevice: (id: string) => Device | undefined;
  addDevice: (d: Omit<Device, "id" | "views" | "createdAt">) => string;
  updateDevice: (id: string, patch: Partial<Device>) => void;
  /** Sell requests failed to load (admins). */
  submissionsError: boolean;
  updateSubmission: (id: string, patch: Partial<Submission>, log?: Omit<LogLine, "at">) => void;
  /** Accept a sell request → creates a draft device from it. Returns the device id. */
  acceptSubmission: (id: string) => string;
  /** Flag a seller account جاد / مشبوه (null = no flag). Applies to all their requests. */
  setSellerTrust: (sellerId: string, trust: Submission["sellerTrust"]) => Promise<void>;
  addRequest: (r: NewRequest) => string;
  updateRequest: (id: string, patch: Partial<DeviceRequest>) => void;
  /** Schedule a new inspection (e.g. from «حدد ميعاد فحص»). Returns its id. */
  addInspection: (i: Omit<Inspection, "id" | "status" | "form">) => string;
  updateInspection: (id: string, patch: Partial<Inspection>) => void;
  /** «اعتمد ونشّر»: marks the inspection done, writes the report to the device,
   *  and publishes it for pre-publish inspections. Returns the device id. */
  approveInspection: (id: string) => string;
  /** Save / unsave a device (signed-in users; others are sent to /login). */
  toggleFavorite: (deviceId: string) => void;
  /** Published devices that match a buyer request (type + budget + inspection pref). */
  matchesFor: (r: DeviceRequest) => Device[];
  reset: () => void;
};

const DemoContext = createContext<DemoApi | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(SEED);
  const [storageReady, setStorageReady] = useState(false);
  // Which user the database data was loaded for («user:isAdmin») — ready only when it's the current one.
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [devicesError, setDevicesError] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(false);
  const loaded = useRef(false);
  const auth = useAuth();
  // Last device list known to match the database (by public code) — the sync
  // effect writes only what differs from it.
  const synced = useRef<Map<string, Device>>(new Map());
  // Same for submissions: the last row (JSON) written for each, by public code.
  const syncedSubs = useRef<Map<string, string>>(new Map());
  // Source of truth for actions: lets an action return the new id right away
  // and lets two actions in one click see each other's result.
  const ref = useRef<DemoState>(SEED);
  const commit = useCallback((fn: (s: DemoState) => DemoState) => {
    ref.current = fn(ref.current);
    setState(ref.current);
  }, []);

  // Hydrate from localStorage once, after the first (server-matching) render.
  useEffect(() => {
    const stored = load();
    if (stored) {
      ref.current = { ...stored, devices: ref.current.devices, favorites: ref.current.favorites, submissions: ref.current.submissions };
      setState(ref.current);
    }
    loaded.current = true;
    setStorageReady(true);
  }, []);

  // Devices from the database; reloaded when the signed-in user changes
  // (admins see drafts and private data).
  const { ready: authReady, userId, isAdmin } = auth;
  const loadKey = authReady ? `${userId ?? "anon"}:${isAdmin}` : null;
  const devicesReady = loadKey !== null && loadedFor === loadKey;
  const ready = storageReady && devicesReady;
  useEffect(() => {
    if (!loadKey) return;
    if (!SUPABASE_URL) {
      void Promise.resolve().then(() => setLoadedFor(loadKey));
      return;
    }
    let alive = true;
    const sb = supabaseBrowser();
    const subs = isAdmin
      ? fetchSubmissions(sb).catch((e) => {
          console.error("submissions load failed", e);
          if (alive) setSubmissionsError(true);
          return [] as Submission[];
        })
      : Promise.resolve([] as Submission[]);
    Promise.all([fetchDevices(sb), userId ? fetchFavorites(sb, userId) : Promise.resolve([] as string[]), subs])
      .then(([devices, favorites, submissions]) => {
        if (!alive) return;
        synced.current = new Map(devices.map((d) => [d.id, d]));
        const dbIds = new Map(devices.map((d) => [d.id, d.dbId]));
        syncedSubs.current = new Map(submissions.map((x) => [x.id, JSON.stringify(workflowRow(x, x.deviceId ? dbIds.get(x.deviceId) : undefined))]));
        ref.current = { ...ref.current, devices, favorites, submissions };
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
  }, [loadKey, userId, isAdmin]);

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

  // Admin changes to sell requests → database. Re-runs when devices change
  // too: a just-accepted request gets its device_id once the draft is saved.
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

  // Save after every change. Uses ref.current (not this render's `state`): on
  // the first client commit the hydration effect above has already put the
  // stored data in ref.current while `state` is still the seed — saving
  // `state` there would overwrite the user's data with the seed.
  useEffect(() => {
    if (loaded.current) save(ref.current);
  }, [state]);

  // Keep tabs in sync (admin in one tab, site in another).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const fresh = load();
      if (fresh) {
        ref.current = { ...fresh, devices: ref.current.devices, favorites: ref.current.favorites, submissions: ref.current.submissions };
        setState(ref.current);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const getDevice = useCallback((id: string) => state.devices.find((d) => d.id === decodeURIComponent(id)), [state.devices]);

  const addDevice: DemoApi["addDevice"] = useCallback((d) => {
    let id = "";
    commit((s) => {
      id = nextCode(s.devices.map((x) => x.id), "L-", 201);
      const device: Device = { ...d, id, views: 0, createdAt: "27 أكتوبر 2026" };
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
        createdAt: "27 أكتوبر 2026",
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

  const addRequest: DemoApi["addRequest"] = useCallback((input) => {
    let id = "";
    commit((s) => {
      id = input.id ?? nextCode(s.requests.map((x) => x.id), "R-", 119);
      const r: DeviceRequest = { ...input, id, createdAt: "27 أكتوبر", status: "new" };
      return { ...s, requests: [r, ...s.requests] };
    });
    return id;
  }, [commit]);

  const updateRequest: DemoApi["updateRequest"] = useCallback((id, patch) => {
    commit((s) => ({ ...s, requests: s.requests.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }, [commit]);

  const addInspection: DemoApi["addInspection"] = useCallback((input) => {
    let id = "";
    commit((s) => {
      id = nextCode(s.inspections.map((x) => x.id), "F-", 306);
      const insp: Inspection = {
        ...input,
        id,
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
        date: "27 أكتوبر 2026",
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
            createdAt: "27 أكتوبر 2026",
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

  const matchesFor: DemoApi["matchesFor"] = useCallback(
    (r) =>
      state.devices.filter(
        (d) =>
          d.status === "published" &&
          d.type === r.deviceType &&
          (!r.budgetMin || d.price >= r.budgetMin) &&
          (!r.budgetMax || d.price <= r.budgetMax) &&
          (r.inspectionPref === "any" || d.inspection === "inspected"),
      ),
    [state.devices],
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    // Demo data only — devices, favorites and submissions stay (they're the database's).
    ref.current = { ...SEED, devices: ref.current.devices, favorites: ref.current.favorites, submissions: ref.current.submissions };
    setState(ref.current);
  }, []);

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
      addRequest,
      updateRequest,
      addInspection,
      updateInspection,
      approveInspection,
      toggleFavorite,
      matchesFor,
      reset,
    }),
    [ready, devicesError, submissionsError, state, getDevice, addDevice, updateDevice, updateSubmission, acceptSubmission, setSellerTrust, addRequest, updateRequest, addInspection, updateInspection, approveInspection, toggleFavorite, matchesFor, reset],
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

