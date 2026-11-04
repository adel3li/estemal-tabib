// The 4-item core inspection checklist (Admin-Inspections «بنود الفحص»).
// The old in-browser demo data is gone — everything comes from Supabase now
// (demo rows for a fresh project: supabase/seed/demo.sql).
// TODO(open question §12.8): per-device-type checklist templates.
import type { CheckKey } from "./types";

export const CORE_CHECKS: { key: CheckKey; label: string }[] = [
  { key: "run", label: "التشغيل" },
  { key: "look", label: "الحالة الظاهرية" },
  { key: "parts", label: "الأجزاء المتغيرة" },
  { key: "maint", label: "الصيانة السابقة" },
];
