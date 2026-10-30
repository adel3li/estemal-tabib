"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { destinationAfterLogin } from "@/lib/auth/after-login";
import { authErrorAr } from "@/lib/auth/messages";
import { supabaseBrowser } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";
import { markSent, otpOptions, secondsLeft } from "./sent";

const LEN = 6;
const toLatin = (s: string) => s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));

export function VerifyForm({ email, next }: { email: string; next: string }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [left, setLeft] = useState(60);
  const input = useRef<HTMLInputElement>(null);
  const lastTried = useRef("");

  useEffect(() => {
    const tick = () => setLeft(secondsLeft(email));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, [email]);

  const verify = async (value: string) => {
    if (value.length !== LEN) {
      setMsg(`الكود ${LEN} أرقام`);
      input.current?.focus();
      return;
    }
    lastTried.current = value;
    setBusy(true);
    setMsg("");
    const { error } = await supabaseBrowser().auth.verifyOtp({ email, token: value, type: "email" });
    if (error) {
      setBusy(false);
      setMsg(authErrorAr(error));
      input.current?.select();
      return;
    }
    setInfo("تمام! بندخّلك…");
    // Full navigation so the server (proxy, pages) sees the new session cookie.
    window.location.replace(await destinationAfterLogin(next));
  };

  const onChange = (raw: string) => {
    const v = toLatin(raw).replace(/\D/g, "").slice(0, LEN);
    setCode(v);
    if (msg) setMsg("");
    // Pasted or autofilled the whole code → check it right away (once per value).
    if (v.length === LEN && v !== lastTried.current && !busy) void verify(v);
  };

  const resend = async () => {
    if (left > 0) return;
    setMsg("");
    setInfo("");
    const { error } = await supabaseBrowser().auth.signInWithOtp({ email, options: otpOptions(next) });
    if (error) {
      setMsg(authErrorAr(error));
      return;
    }
    markSent(email);
    setLeft(secondsLeft(email));
    setCode("");
    lastTried.current = "";
    setInfo("بعتنالك كود جديد.");
    input.current?.focus();
  };

  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");

  return (
    <section className="au-wrap">
      <div className="au-card">
        <span className="au-icon">
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <h1 className="au-h1">اكتب الكود</h1>
          <p className="au-lead">
            بعتنا كود من {LEN} أرقام على{" "}
            <bdi dir="ltr" style={{ fontWeight: 700, color: "#12221F", overflowWrap: "anywhere" }}>
              {email}
            </bdi>
            . لو مش لاقيه، بص في الـ Spam.
          </p>
          {/* Supabase's built-in mailer (free plan) can only send a sign-in link; the
              6-digit code arrives once custom SMTP (Resend) is set — DECISIONS.md. */}
          <p className="au-small" style={{ margin: 0 }}>
            لو الإيميل جالك فيه زرار «Sign in» بدل الكود، دوس عليه من الموبايل أو الكمبيوتر ده وهتدخل على طول.
          </p>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void verify(code);
          }}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <label className="au-field" htmlFor="au-code">
            الكود
            <input
              ref={input}
              id="au-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              enterKeyHint="done"
              pattern="[0-9]*"
              maxLength={LEN + 4}
              dir="ltr"
              autoFocus
              placeholder="••••••"
              className={msg ? "au-in au-code au-bad" : "au-in au-code"}
              value={code}
              aria-invalid={msg ? true : undefined}
              aria-describedby={msg ? "au-code-msg" : undefined}
              onChange={(e) => onChange(e.target.value)}
            />
            {msg ? (
              <span id="au-code-msg" className="au-msg" role="alert">
                {msg}
              </span>
            ) : null}
            {info ? (
              <span className="au-ok" role="status">
                {info}
              </span>
            ) : null}
          </label>
          <button type="submit" className="au-btn au-primary" disabled={busy}>
            {busy ? "بنتأكد…" : "ادخل"}
          </button>
        </form>

        <div className="au-row">
          <button type="button" className="au-link" onClick={resend} disabled={left > 0}>
            {left > 0 ? `ابعت كود جديد بعد ${mm}:${ss}` : "ابعت كود جديد"}
          </button>
          <Link className="au-link" href={`${routes.login}?next=${encodeURIComponent(next)}&email=${encodeURIComponent(email)}`}>
            غيّر الإيميل
          </Link>
        </div>
      </div>
    </section>
  );
}
