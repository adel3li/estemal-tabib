import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { default: "لوحة التحكم", template: "%s — لوحة التحكم" },
  robots: { index: false, follow: false },
};

// role = admin only. src/middleware.ts already redirects/blocks; this is the second
// lock in case the proxy is ever bypassed. RLS guards the data itself.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) notFound();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  if (profile?.role !== "admin") notFound();
  return <AdminShell>{children}</AdminShell>;
}
