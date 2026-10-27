import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "لوحة التحكم", template: "%s — لوحة التحكم" },
  robots: { index: false, follow: false },
};

// TODO(Step 3): gate behind login + role = admin (PHASE1_PROMPT.md §6, §9).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
