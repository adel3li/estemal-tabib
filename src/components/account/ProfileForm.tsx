"use client";

// Profile fields (PHASE1_PROMPT.md §6): used once on /onboarding and again in
// /account → بياناتي. Phone is stored as typed digits; phone_verified stays false
// (the team verifies it on the first WhatsApp contact).
import { useState } from "react";
import { GOVERNORATES } from "@/lib/demo/labels";
import { useAuth, type AccountType, type Profile } from "@/lib/auth/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { isEgyptMobile, normalizePhone } from "@/app/(site)/sell/form";

export const ACCOUNT_TYPES: { id: AccountType; label: string }[] = [
  { id: "doctor", label: "طبيب" },
  { id: "student", label: "طالب" },
  { id: "clinic", label: "عيادة أو مركز" },
];

type Key = "full_name" | "phone" | "governorate" | "account_type";
type Errors = Partial<Record<Key, string>>;
const ORDER: Key[] = ["full_name", "phone", "governorate", "account_type"];
const fid = (k: Key) => `pf-${k}`;

type Form = { full_name: string; phone: string; governorate: string; address: string; account_type: AccountType | "" };

function validate(f: Form): Errors {
  const e: Errors = {};
  if (f.full_name.trim().length < 3) e.full_name = "اكتب اسمك بالكامل";
  if (!f.phone.trim()) e.phone = "اكتب رقم موبايلك اللي عليه واتساب";
  else if (!isEgyptMobile(f.phone)) e.phone = "الرقم لازم يكون 11 رقم ويبدأ بـ 01";
  if (!f.governorate) e.governorate = "اختار المحافظة";
  if (!f.account_type) e.account_type = "اختار نوع الحساب";
  return e;
}

function Msg({ k, err }: { k: Key; err: Errors }) {
  return err[k] ? (
    <span id={`${fid(k)}-msg`} className="au-msg" role="alert">
      {err[k]}
    </span>
  ) : null;
}

function Req() {
  return (
    <span className="au-req" aria-hidden="true">
      *
    </span>
  );
}

export function ProfileForm({
  profile,
  submitLabel,
  onSaved,
}: {
  profile: Pick<Profile, "id" | "full_name" | "phone" | "governorate" | "address" | "account_type" | "onboarded_at">;
  submitLabel: string;
  onSaved: () => void;
}) {
  const { refresh } = useAuth();
  const [f, setF] = useState<Form>({
    full_name: profile.full_name ?? "",
    phone: profile.phone ?? "",
    governorate: profile.governorate ?? "",
    address: profile.address ?? "",
    account_type: profile.account_type ?? "",
  });
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const err: Errors = tried ? validate(f) : {};
  const set = (patch: Partial<Form>) => {
    setF((p) => ({ ...p, ...patch }));
    setSaved(false);
  };

  const save = async () => {
    setTried(true);
    const e = validate(f);
    const first = ORDER.find((k) => e[k]);
    if (first) {
      document.getElementById(fid(first))?.focus();
      return;
    }
    setBusy(true);
    setMsg("");
    const { error } = await supabaseBrowser()
      .from("profiles")
      .update({
        full_name: f.full_name.trim(),
        phone: normalizePhone(f.phone),
        governorate: f.governorate,
        address: f.address.trim() || null,
        account_type: f.account_type,
        onboarded_at: profile.onboarded_at ?? new Date().toISOString(),
      })
      .eq("id", profile.id);
    setBusy(false);
    if (error) {
      setMsg("ما قدرناش نحفظ دلوقتي. جرّب تاني بعد شوية.");
      return;
    }
    await refresh();
    setSaved(true);
    onSaved();
  };

  const bad = (k: Key) => (err[k] ? { "aria-invalid": true as const, "aria-describedby": `${fid(k)}-msg` } : {});
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div className="au-grid">
        <label className="au-field" htmlFor={fid("full_name")}>
          <span>
            الاسم بالكامل<Req />
          </span>
          <input id={fid("full_name")} type="text" autoComplete="name" enterKeyHint="next" aria-required className={err.full_name ? "au-in au-bad" : "au-in"} value={f.full_name} onChange={(e) => set({ full_name: e.target.value })} {...bad("full_name")} />
          <Msg k="full_name" err={err} />
        </label>
        <label className="au-field" htmlFor={fid("phone")}>
          <span>
            رقم الموبايل (واتساب)<Req />
          </span>
          <input id={fid("phone")} type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="next" dir="ltr" placeholder="01xxxxxxxxx" aria-required style={{ textAlign: "right" }} className={err.phone ? "au-in au-bad" : "au-in"} value={f.phone} onChange={(e) => set({ phone: e.target.value })} {...bad("phone")} />
          <Msg k="phone" err={err} />
        </label>
        <label className="au-field" htmlFor={fid("governorate")}>
          <span>
            المحافظة<Req />
          </span>
          <select id={fid("governorate")} aria-required className={err.governorate ? "au-in au-bad" : "au-in"} value={f.governorate} onChange={(e) => set({ governorate: e.target.value })} {...bad("governorate")}>
            <option value="">اختار المحافظة</option>
            {GOVERNORATES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <Msg k="governorate" err={err} />
        </label>
        <label className="au-field" htmlFor="pf-address">
          العنوان (اختياري)
          <input id="pf-address" type="text" autoComplete="street-address" enterKeyHint="done" placeholder="الحي، الشارع، علامة مميزة" className="au-in" value={f.address} onChange={(e) => set({ address: e.target.value })} />
        </label>
      </div>

      <div className="au-field" role="group" aria-labelledby="pf-type-label">
        <span id="pf-type-label">
          نوع الحساب<Req />
        </span>
        <div className="au-chips" role="radiogroup" aria-labelledby="pf-type-label">
          {ACCOUNT_TYPES.map((t, i) => (
            <button
              key={t.id}
              id={i === 0 ? fid("account_type") : undefined}
              type="button"
              role="radio"
              aria-checked={f.account_type === t.id}
              className={err.account_type ? "au-chip au-bad" : "au-chip"}
              onClick={() => set({ account_type: t.id })}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Msg k="account_type" err={err} />
      </div>

      {msg ? (
        <span className="au-msg" role="alert">
          {msg}
        </span>
      ) : null}
      {saved ? (
        <span className="au-ok" role="status">
          اتحفظت بياناتك.
        </span>
      ) : null}
      <button type="submit" className="au-btn au-primary" disabled={busy}>
        {busy ? "بنحفظ…" : submitLabel}
      </button>
    </form>
  );
}
