import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { safeNext } from "@/lib/auth/next";
import { routes } from "@/lib/routes";
import { VerifyForm } from "./VerifyForm";
import "../../_auth/auth.css";

export const metadata: Metadata = { title: "اكتب الكود", robots: { index: false } };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const email = (q.email ?? "").trim().toLowerCase();
  const next = safeNext(q.next);
  if (!email) redirect(`${routes.login}?next=${encodeURIComponent(next)}`);
  return (
    <div className="au-root">
      <VerifyForm email={email} next={next} />
    </div>
  );
}
