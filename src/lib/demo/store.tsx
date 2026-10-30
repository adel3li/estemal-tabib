"use client";

// Demo data store shared by every page (public site + admin).
// Persists to localStorage so what you do in the admin shows up on the site
// in the same browser. Replaced by Supabase in Step 2 (PHASE1_PROMPT.md §7).

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
import { sellerNetFromSalePrice } from "@/config/business";
import { CORE_CHECKS, DEMO_VERSION, SEED } from "./seed";
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

function load(): DemoState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoState;
    return parsed.version === DEMO_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

function save(state: DemoState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

const today = () => "النهارده";

type NewSubmission = Omit<Submission, "id" | "createdAt" | "status" | "log" | "feeStatus" | "sellerNet" | "feeReference"> &
  Partial<Pick<Submission, "feeReference" | "id">>;
// `id`: the public code the database gave the row, so the demo admin shows the same number.
type NewRequest = Omit<DeviceRequest, "id" | "createdAt" | "status" | "notifiedAt"> & Partial<Pick<DeviceRequest, "id">>;

export type DemoApi = {
  /** false until localStorage has been read (first client render uses the seed). */
  ready: boolean;
  state: DemoState;
  getDevice: (id: string) => Device | undefined;
  addDevice: (d: Omit<Device, "id" | "views" | "createdAt">) => string;
  updateDevice: (id: string, patch: Partial<Device>) => void;
  addSubmission: (s: NewSubmission) => string;
  updateSubmission: (id: string, patch: Partial<Submission>, log?: Omit<LogLine, "at">) => void;
  /** Accept a sell request → creates a draft device from it. Returns the device id. */
  acceptSubmission: (id: string) => string;
  addRequest: (r: NewRequest) => string;
  updateRequest: (id: string, patch: Partial<DeviceRequest>) => void;
  /** Schedule a new inspection (e.g. from «حدد ميعاد فحص»). Returns its id. */
  addInspection: (i: Omit<Inspection, "id" | "status" | "form">) => string;
  updateInspection: (id: string, patch: Partial<Inspection>) => void;
  /** «اعتمد ونشّر»: marks the inspection done, writes the report to the device,
   *  and publishes it for pre-publish inspections. Returns the device id. */
  approveInspection: (id: string) => string;
  toggleFavorite: (deviceId: string) => void;
  /** Published devices that match a buyer request (type + budget + inspection pref). */
  matchesFor: (r: DeviceRequest) => Device[];
  reset: () => void;
};

const DemoContext = createContext<DemoApi | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(SEED);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);
  // Source of truth for actions: lets an action return the new id right away
  // and lets two actions in one click see each other's result.
  const ref = useRef<DemoState>(SEED);
  const commit = useCallback((fn: (s: DemoState) => DemoState) => {
    ref.current = fn(ref.current);
    setState(ref.current);
  }, []);

  // Hydrate from localStorage once, after the first (server-matching) render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = load();
    if (stored) {
      ref.current = stored;
      setState(stored);
    }
    loaded.current = true;
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

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
        ref.current = fresh;
        setState(fresh);
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

  const addSubmission: DemoApi["addSubmission"] = useCallback((input) => {
    let id = "";
    commit((s) => {
      id = input.id ?? nextCode(s.submissions.map((x) => x.id), "#", 1025);
      const sub: Submission = {
        ...input,
        id,
        createdAt: `${today()} ${new Date().toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" })}`,
        status: "new",
        feeStatus: "pending",
        feeReference: input.feeReference ?? "",
        sellerNet: sellerNetFromSalePrice(input.salePrice),
        log: [{ text: "الطلب وصل من صفحة «اعرض جهازك»", at: today(), tone: "info" }],
      };
      return { ...s, submissions: [sub, ...s.submissions] };
    });
    return id;
  }, [commit]);

  const updateSubmission: DemoApi["updateSubmission"] = useCallback((id, patch, log) => {
    commit((s) => ({
      ...s,
      submissions: s.submissions.map((x) =>
        x.id === id ? { ...x, ...patch, log: log ? [...x.log, { ...log, at: today() }] : x.log } : x,
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
                log: [...y.log, { text: `اتقبل واتحول لإعلان مسودة (${deviceId})`, at: today(), tone: "ok" }],
              }
            : y,
        ),
      };
    });
    return deviceId;
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
    commit((s) => ({
      ...s,
      favorites: s.favorites.includes(deviceId)
        ? s.favorites.filter((x) => x !== deviceId)
        : [...s.favorites, deviceId],
    }));
  }, [commit]);

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
    ref.current = SEED;
    setState(SEED);
  }, []);

  const api = useMemo<DemoApi>(
    () => ({
      ready,
      state,
      getDevice,
      addDevice,
      updateDevice,
      addSubmission,
      updateSubmission,
      acceptSubmission,
      addRequest,
      updateRequest,
      addInspection,
      updateInspection,
      approveInspection,
      toggleFavorite,
      matchesFor,
      reset,
    }),
    [ready, state, getDevice, addDevice, updateDevice, addSubmission, updateSubmission, acceptSubmission, addRequest, updateRequest, addInspection, updateInspection, approveInspection, toggleFavorite, matchesFor, reset],
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
export const isPublic = (d: Device) => d.status === "published" || d.status === "reserved" || d.status === "sold";

