"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authErrorAr, isEmail } from "@/lib/auth/messages";
import { supabaseBrowser } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";
import { reasonFor } from "./reasons";
import { markSent, otpOptions } from "./verify/sent";

type Props = { next: string; hasNext: boolean; initialEmail: string; google: boolean; error: boolean };

export function LoginForm({ next, hasNext, initialEmail, google, error }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [msg, setMsg] = useState(error ? "الدخول ما كملش. جرّب تاني." : "");
  const [gMsg, setGMsg] = useState("");
  const [busy, setBusy] = useState<"" | "email" | "google">("");

  const sendCode = async () => {
    const v = email.trim().toLowerCase();
    if (!isEmail(v)) {
      setMsg("اكتب إيميل صحيح، زي name@gmail.com");
      document.getElementById("au-email")?.focus();
      return;
    }
    setBusy("email");
    setMsg("");
    const { error: err } = await supabaseBrowser().auth.signInWithOtp({ email: v, options: otpOptions(next) });
    if (err) {
      setBusy("");
      setMsg(authErrorAr(err));
      return;
    }
    markSent(v);
    router.push(`${routes.verify}?email=${encodeURIComponent(v)}&next=${encodeURIComponent(next)}`);
  };

  const withGoogle = async () => {
    if (!google) {
      setGMsg("الدخول بجوجل لسه بيتجهز. ادخل بالإيميل دلوقتي.");
      return;
    }
    setBusy("google");
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error: err } = await supabaseBrowser().auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (err) {
      setBusy("");
      setGMsg(authErrorAr(err));
    }
  };

  return (
    <section className="au-wrap">
      <div className="au-card">
        <span className="au-icon">
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <h1 className="au-h1">ادخل حسابك</h1>
          <p className="au-lead">أول مرة؟ هنعملك حساب في نفس الخطوة. من غير باسورد.</p>
        </div>

        {hasNext ? <p className="au-note" style={{ margin: 0 }}>{reasonFor(next)}</p> : null}

        <button type="button" className="au-btn au-google" onClick={withGoogle} disabled={busy !== ""} aria-describedby={gMsg ? "au-gmsg" : undefined}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          {busy === "google" ? "ثانية واحدة…" : "كمّل بحساب جوجل"}
        </button>
        {gMsg ? (
          <span id="au-gmsg" className="au-msg" role="alert">
            {gMsg}
          </span>
        ) : null}

        <div className="au-or">أو بالإيميل</div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void sendCode();
          }}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <label className="au-field" htmlFor="au-email">
            الإيميل
            <input
              id="au-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              enterKeyHint="send"
              dir="ltr"
              placeholder="name@gmail.com"
              className={msg ? "au-in au-bad" : "au-in"}
              style={{ textAlign: "right" }}
              value={email}
              aria-invalid={msg ? true : undefined}
              aria-describedby={msg ? "au-email-msg" : "au-email-hint"}
              onChange={(e) => setEmail(e.target.value)}
            />
            {msg ? (
              <span id="au-email-msg" className="au-msg" role="alert">
                {msg}
              </span>
            ) : (
              <span id="au-email-hint" className="au-small" style={{ fontWeight: 400 }}>
                هنبعتلك كود من 6 أرقام على الإيميل ده.
              </span>
            )}
          </label>
          <button type="submit" className="au-btn au-primary" disabled={busy !== ""}>
            {busy === "email" ? "بنبعت الكود…" : "ابعتلي الكود"}
          </button>
        </form>

        <p className="au-small" style={{ margin: 0 }}>
          بدخولك إنت موافق على <Link href={routes.terms}>شروط البيع والشراء</Link>.
        </p>
      </div>
    </section>
  );
}
