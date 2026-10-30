"use client";

// /account tabs (PHASE1_PROMPT.md §6): أجهزتي المعروضة · طلبات «اطلب جهاز» ·
// المحفوظات · بياناتي · طلباتي (قريباً — Phase 2).
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { ProfileForm, ACCOUNT_TYPES } from "@/components/account/ProfileForm";
import { BUSINESS } from "@/config/business";
import type { Profile } from "@/lib/auth/AuthProvider";
import { fmt, typeLabel } from "@/lib/demo/labels";
import { routes } from "@/lib/routes";
import { supabaseBrowser } from "@/lib/supabase/client";
import { dateAr, type MyFavorite, type MyRequest, type MySubmission } from "./data";

export type TabId = "devices" | "requests" | "saved" | "profile" | "orders";

const SUB_ST: Record<MySubmission["status"], [string, string, string]> = {
  new: ["وصل وبنراجعه", "#E6EDF7", "#24508F"],
  follow_up: ["محتاجين منك حاجة", "#FBEEDC", "#8A4209"],
  accepted: ["اتقبل", "#EAF5DD", "#3F7A1F"],
  rejected: ["اترفض", "#FBE9E7", "#B3261E"],
};
const FEE_ST: Record<MySubmission["fee_status"], [string, string, string]> = {
  pending: ["رسوم الجدية لسه ما اتدفعتش", "#FBEEDC", "#8A4209"],
  paid: ["رسوم الجدية اتدفعت ✓", "#EAF5DD", "#3F7A1F"],
  refunded: ["رسوم الجدية اترجعت", "#E6EDF7", "#24508F"],
  forfeited: ["رسوم الجدية اتخصمت", "#FBE9E7", "#B3261E"],
};
const REQ_ST: Record<MyRequest["status"], [string, string, string]> = {
  new: ["بندوّر لك", "#FBEEDC", "#8A4209"],
  notified: ["بلّغناك على واتساب", "#E6EDF7", "#24508F"],
  closed: ["مقفول", "#E5EBE8", "#4A5A56"],
};

const Pill = ({ s }: { s: [string, string, string] }) => (
  <span className="au-pill" style={{ background: s[1], color: s[2] }}>
    {s[0]}
  </span>
);

function Empty({ title, text, href, cta }: { title: string; text: string; href: string; cta: string }) {
  return (
    <div className="au-empty">
      <strong style={{ fontSize: 18 }}>{title}</strong>
      <span className="au-small">{text}</span>
      <Link href={href} className="au-btn au-primary">
        {cta}
      </Link>
    </div>
  );
}

function FeeRef({ sub }: { sub: MySubmission }) {
  const [ref, setRef] = useState(sub.fee_reference ?? "");
  const [saved, setSaved] = useState(sub.fee_reference ?? "");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const id = `fee-${sub.id}`;
  const save = async () => {
    const v = ref.trim();
    if (v.length < 4) {
      setMsg("اكتب رقم التحويل زي ما ظاهر في رسالة البنك أو إنستاباي");
      return;
    }
    setBusy(true);
    const { error } = await supabaseBrowser().from("seller_submissions").update({ fee_reference: v }).eq("id", sub.id);
    setBusy(false);
    if (error) setMsg("ما قدرناش نحفظ دلوقتي. جرّب تاني.");
    else {
      setMsg("");
      setSaved(v);
    }
  };
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, paddingTop: 10, borderTop: "1px solid #EDF1EF" }}
    >
      <label htmlFor={id} className="au-field">
        حوّل {BUSINESS.sellerSeriousnessFeeEGP} ج.م بحد أدنى على {BUSINESS.feeTransferDetails} واكتب رقم التحويل
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <input id={id} type="text" dir="ltr" inputMode="text" autoComplete="off" enterKeyHint="done" placeholder="رقم التحويل" className="au-in" style={{ flex: "1 1 180px", textAlign: "right", minHeight: 48 }} value={ref} onChange={(e) => setRef(e.target.value)} aria-describedby={msg ? `${id}-msg` : undefined} />
        <button type="submit" className="au-btn au-primary" style={{ width: "auto", flex: "0 1 auto", minHeight: 48, fontSize: 15 }} disabled={busy}>
          {saved ? "حدّث الرقم" : "احفظ الرقم"}
        </button>
      </div>
      {msg ? (
        <span id={`${id}-msg`} className="au-msg" role="alert">
          {msg}
        </span>
      ) : saved ? (
        <span className="au-ok" role="status">
          سجّلنا رقم التحويل: <bdi dir="ltr">{saved}</bdi>. هنراجعه ونأكدلك.
        </span>
      ) : null}
    </form>
  );
}

export function AccountTabs({
  initialTab,
  profile,
  submissions,
  requests,
  favorites,
  failed,
}: {
  initialTab: TabId;
  profile: Profile;
  submissions: MySubmission[];
  requests: MyRequest[];
  favorites: MyFavorite[];
  failed: boolean;
}) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const listRef = useRef<HTMLDivElement>(null);

  const TABS: { id: TabId; label: string; count?: number; soon?: boolean }[] = [
    { id: "devices", label: "أجهزتي المعروضة", count: submissions.length },
    { id: "requests", label: "طلبات «اطلب جهاز»", count: requests.length },
    { id: "saved", label: "المحفوظات", count: favorites.length },
    { id: "profile", label: "بياناتي" },
    { id: "orders", label: "طلباتي", soon: true },
  ];

  const choose = (id: TabId, focus = false) => {
    setTab(id);
    try {
      window.history.replaceState(null, "", `${routes.account}?tab=${id}`);
    } catch {
      /* ignore */
    }
    if (focus) listRef.current?.querySelector<HTMLElement>(`#tab-${id}`)?.focus();
  };

  // Arrow keys move between tabs (RTL: right = previous).
  const onKey = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const step = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (e.key === "Home") choose(TABS[0].id, true);
    else if (e.key === "End") choose(TABS[TABS.length - 1].id, true);
    else if (step) choose(TABS[(i + step + TABS.length) % TABS.length].id, true);
    else return;
    e.preventDefault();
  };

  const typeTxt = ACCOUNT_TYPES.find((t) => t.id === profile.account_type)?.label;

  return (
    <section className="au-wrap au-wide">
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 className="au-h1">حسابي</h1>
        <p className="au-lead">
          أهلاً {profile.full_name || ""}
          {typeTxt ? ` · ${typeTxt}` : ""}
        </p>
      </div>

      {failed ? (
        <p className="au-note" role="alert" style={{ margin: 0 }}>
          فيه بيانات ما اتحمّلتش. حدّث الصفحة بعد شوية.
        </p>
      ) : null}

      <div ref={listRef} className="au-tabs" role="tablist" aria-label="أقسام حسابك" onKeyDown={onKey}>
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            className="au-tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => choose(t.id)}
          >
            {t.label}
            {t.soon ? <span className="au-soon">قريباً</span> : null}
            {t.count ? <span className="au-count">{t.count}</span> : null}
          </button>
        ))}
      </div>

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} style={{ outline: "none" }}>
        {tab === "devices" ? (
          submissions.length ? (
            <ul className="au-list">
              {submissions.map((s) => (
                <li key={s.id} className="au-item">
                  <div className="au-item-main">
                    <span className="au-item-title">{s.details || typeLabel(s.device_type)}</span>
                    <span className="au-item-meta">
                      <span>
                        رقم الطلب <bdi dir="ltr">{s.public_code}</bdi>
                      </span>
                      <span>{typeLabel(s.device_type)}</span>
                      <span>{dateAr(s.created_at)}</span>
                      <span>{s.sale_price ? `${fmt(s.sale_price)} ج.م` : s.price_help ? "طلبت مساعدة في السعر" : ""}</span>
                    </span>
                    {s.status === "rejected" && s.reject_reason ? <span className="au-small">السبب: {s.reject_reason}</span> : null}
                  </div>
                  <div className="au-pills">
                    <Pill s={SUB_ST[s.status]} />
                    <Pill s={FEE_ST[s.fee_status]} />
                  </div>
                  {s.fee_status === "pending" && s.status !== "rejected" ? <FeeRef sub={s} /> : null}
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="لسه ما عرضتش أجهزة" text="اعرض جهازك وإحنا نفحصه ونعرضه للدكاترة." href={routes.sell} cta="اعرض جهازك" />
          )
        ) : null}

        {tab === "requests" ? (
          requests.length ? (
            <ul className="au-list">
              {requests.map((r) => (
                <li key={r.id} className="au-item">
                  <div className="au-item-main">
                    <span className="au-item-title">
                      {typeLabel(r.device_type)}
                      {r.brand_pref ? ` · ${r.brand_pref}` : ""}
                    </span>
                    <span className="au-item-meta">
                      <span>
                        رقم الطلب <bdi dir="ltr">{r.public_code}</bdi>
                      </span>
                      {r.budget_min || r.budget_max ? (
                        <span>
                          الميزانية: {r.budget_min ? fmt(r.budget_min) : "—"} – {r.budget_max ? fmt(r.budget_max) : "—"} ج.م
                        </span>
                      ) : null}
                      {r.needed_by ? <span>{r.needed_by}</span> : null}
                      <span>{dateAr(r.created_at)}</span>
                    </span>
                  </div>
                  <div className="au-pills" style={{ alignItems: "center" }}>
                    <Pill s={REQ_ST[r.status]} />
                    {r.matches ? (
                      <Link href={`${routes.devices}?cat=${r.device_type}`} className="au-pill" style={{ background: "#E3F0ED", color: "#0D5C55" }}>
                        {r.matches === 1 ? "جهاز واحد مطابق" : `${r.matches} أجهزة مطابقة`}
                      </Link>
                    ) : (
                      <span className="au-pill" style={{ background: "#F5F7F4", color: "#4A5A56" }}>
                        لسه مفيش جهاز مطابق
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="مفيش طلبات لسه" text="قولنا محتاج إيه وهنبلغك على واتساب أول ما يتعرض جهاز مناسب." href={routes.request} cta="اطلب جهاز" />
          )
        ) : null}

        {tab === "saved" ? (
          favorites.length ? (
            <ul className="au-list">
              {favorites.map((f) => (
                <li key={f.device_id} className="au-item">
                  <div className="au-item-main">
                    <Link href={routes.device(f.public_code)} className="au-item-title">
                      {f.title}
                    </Link>
                    <span className="au-item-meta">
                      <bdi dir="ltr">{f.public_code}</bdi>
                      <span>{fmt(f.sale_price)} ج.م</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            // TODO(Step 4): «احفظ» button on device pages once they read devices from the database.
            <Empty title="لسه ما حفظتش أجهزة" text="الأجهزة اللي تحفظها هتلاقيها هنا." href={routes.devices} cta="تصفح الأجهزة" />
          )
        ) : null}

        {tab === "profile" ? (
          <div className="au-card">
            <span className="au-small">
              الإيميل: <bdi dir="ltr">{profile.email}</bdi>
            </span>
            <ProfileForm profile={profile} submitLabel="احفظ التعديلات" onSaved={() => undefined} />
          </div>
        ) : null}

        {tab === "orders" ? (
          <div className="au-empty">
            <span className="au-soon" style={{ fontSize: 14 }}>
              قريباً
            </span>
            <strong style={{ fontSize: 18 }}>هنا هتتابع طلبات الشراء خطوة بخطوة</strong>
            <span className="au-small">من تأكيد الطلب لحد ما الجهاز يوصل لحد باب بيتك وتخلص فترة التجربة.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
