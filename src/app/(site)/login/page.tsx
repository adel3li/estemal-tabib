import type { Metadata } from "next";
import { googleEnabled } from "@/lib/auth/providers";
import { safeNext } from "@/lib/auth/next";
import { LoginForm } from "./LoginForm";
import "../_auth/auth.css";

export const metadata: Metadata = { title: "ادخل حسابك", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const next = safeNext(q.next);
  return (
    <div className="au-root">
      <LoginForm next={next} hasNext={Boolean(q.next)} initialEmail={q.email ?? ""} google={await googleEnabled()} error={q.error === "callback"} />
    </div>
  );
}
