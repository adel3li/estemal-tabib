"use client";

// «العملاء» — one page per customer (docs/ADMIN_SPEC.md §7, open point E):
// contact, account flag, their sell requests, orders and «اطلب جهاز»
// requests, and a notes log the team writes after each call / WhatsApp, so
// anyone can pick a customer up. Team page (marketing sees no money and no
// sell requests — RLS). Not in the design files.
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { typeLabel } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import { downloadCsv, fileDate } from "@/lib/export";
import { ORDER_STEPS, realPhone, useOrders } from "@/lib/orders/orders";
import { routes } from "@/lib/routes";
import { useSettings } from "@/lib/settings";
import { whenAr } from "@/lib/submissions/db";
import { supabaseBrowser } from "@/lib/supabase/client";
import "../home.css";

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  governorate: string | null;
  account_type: "doctor" | "student" | "clinic" | null;
  trust: "serious" | "suspicious" | null;
  role: string;
  created_at: string;
};
type Note = { id: number; body: string; created_at: string; author: { full_name: string | null } | null };

const ACCOUNT: Record<string, string> = { doctor: "طبيب", student: "طالب", clinic: "عيادة / مركز" };
const digits = (p?: string | null) => (p ?? "").replace(/[^0-9]/g, "").replace(/^20/, "0");
const day = (iso: string) => whenAr(iso).split("،")[0];

export default function CustomersRoute() {
  return (
    <Suspense>
      <CustomersPage />
    </Suspense>
  );
}

function CustomersPage() {
  const openId = useSearchParams().get("open");
  const { isAdmin } = useAuth();
  const { ready, state, setSellerTrust } = useDemo();
  const orders = useOrders();
  const { wa } = useSettings();
  const [list, setList] = useState<Customer[] | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "suspicious" | "serious">("all");
  const [sel, setSel] = useState<string | null>(openId);
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  const loadList = useCallback(async () => {
    const { data } = await supabaseBrowser()
      .from("profiles")
      .select("id, full_name, email, phone, governorate, account_type, trust, role, created_at")
      .order("created_at", { ascending: false });
    setList(((data ?? []) as Customer[]).filter((c) => c.role === "user"));
  }, []);
  useEffect(() => {
    void Promise.resolve().then(loadList);
  }, [loadList]);

  const loadNotes = useCallback(async (id: string) => {
    const { data } = await supabaseBrowser().from("customer_notes").select("id, body, created_at, author:profiles!customer_notes_author_id_fkey(full_name)").eq("customer_id", id).order("created_at", { ascending: false });
    setNotes((data ?? []) as unknown as Note[]);
  }, []);
  useEffect(() => {
    if (sel) void Promise.resolve().then(() => loadNotes(sel));
  }, [sel, loadNotes]);

  // Everything we have for one customer: by account, or by phone for orders typed in by hand.
  const historyOf = useCallback(
    (c: Customer) => {
      const ph = digits(c.phone);
      return {
        subs: state.submissions.filter((s) => s.sellerId === c.id),
        reqs: state.requests.filter((r) => r.userId === c.id),
        ords: orders.orders.filter((o) => o.buyerId === c.id || (!!ph && digits(o.buyerPhone) === ph)),
      };
    },
    [state.submissions, state.requests, orders.orders],
  );

  const needle = q.trim().toLowerCase();
  const shown = useMemo(
    () =>
      (list ?? []).filter(
        (c) =>
          (filter === "all" || c.trust === filter) &&
          (!needle || `${c.full_name ?? ""} ${c.email ?? ""} ${c.phone ?? ""} ${c.governorate ?? ""}`.toLowerCase().includes(needle)),
      ),
    [list, filter, needle],
  );
  const cur = (list ?? []).find((c) => c.id === sel) ?? null;
  const h = cur ? historyOf(cur) : null;

  const addNote = async () => {
    if (!cur || !note.trim()) return;
    const { error } = await supabaseBrowser().from("customer_notes").insert({ customer_id: cur.id, body: note.trim() });
    if (error) {
      setMsg("ما قدرناش نحفظ الملاحظة. جرّب تاني.");
      return;
    }
    setNote("");
    setMsg("");
    await loadNotes(cur.id);
  };

  const flag = async (t: Customer["trust"]) => {
    if (!cur) return;
    try {
      await setSellerTrust(cur.id, t);
      await loadList();
    } catch {
      setMsg("ما قدرناش نحفظ تقييم الحساب.");
    }
  };

  const exportCsv = () =>
    downloadCsv(
      `العملاء-${fileDate()}`,
      ["الاسم", "الموبايل", "الإيميل", "المحافظة", "نوع الحساب", "التقييم", "طلبات بيع", "طلبات شراء", "اطلب جهاز", "اتسجل"],
      shown.map((c) => {
        const x = historyOf(c);
        return [c.full_name, c.phone, c.email, c.governorate, c.account_type ? ACCOUNT[c.account_type] : "", c.trust === "suspicious" ? "مشبوه" : c.trust === "serious" ? "جاد" : "", x.subs.length, x.ords.length, x.reqs.length, day(c.created_at)];
      }),
    );

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <div>
          <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › العملاء</div>
          <h1 className="hm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>العملاء</h1>
          <div style={{ color: "#4A5A56" }}>كل عميل بتاريخه: طلباته، والملاحظات اللي الفريق كتبها بعد كل مكالمة أو واتساب.</div>
        </div>
        <button type="button" className="ad-btn ad-sec" onClick={exportCsv} disabled={!shown.length}>نزّل Excel (CSV)</button>
      </div>

      {!list || !ready || !orders.ready ? (
        <div className="ad-card" role="status" style={{ minHeight: 160, alignItems: "center", justifyContent: "center", color: "#4A5A56" }}>بنحمّل…</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
          <section className="ad-card" aria-label="قائمة العملاء" style={{ flex: "1 1 360px", minWidth: 0, gap: 10 }}>
            <input type="search" className="ad-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="الاسم، الموبايل، الإيميل أو المحافظة" aria-label="ابحث في العملاء" />
            <div role="group" aria-label="فلترة" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {([["all", "الكل"], ["serious", "جاد"], ["suspicious", "مشبوه"]] as const).map(([k, l]) => (
                <button key={k} type="button" className="ad-chip" aria-pressed={filter === k} onClick={() => setFilter(k)} style={{ border: `1px solid ${filter === k ? "#0D5C55" : "#C9D4CF"}`, background: filter === k ? "#0D5C55" : "#FFFFFF", color: filter === k ? "#FFFFFF" : "#12221F" }}>
                  {l}
                </button>
              ))}
            </div>
            <div className="hm-items">
              {shown.map((c) => {
                const x = historyOf(c);
                return (
                  <button key={c.id} type="button" className="hm-item" aria-pressed={sel === c.id} onClick={() => setSel(c.id)} style={{ textAlign: "right", font: "inherit", background: sel === c.id ? "#F1F8F6" : "#FFFFFF", borderColor: sel === c.id ? "#0D5C55" : undefined, cursor: "pointer" }}>
                    <span style={{ minWidth: 0, display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
                      <b style={{ overflowWrap: "anywhere" }}>{c.full_name || c.email || "—"}</b>
                      <span className="hm-sub"><span dir="ltr">{c.phone || "—"}</span> · {c.governorate || "—"}{c.account_type ? ` · ${ACCOUNT[c.account_type]}` : ""}</span>
                      <span className="hm-sub">{[x.subs.length && `${x.subs.length} بيع`, x.ords.length && `${x.ords.length} شراء`, x.reqs.length && `${x.reqs.length} اطلب جهاز`].filter(Boolean).join(" · ") || "لسه مفيش طلبات"}</span>
                    </span>
                    {c.trust ? <span className="hm-pill" style={c.trust === "suspicious" ? { background: "#FBE9E7", color: "#B3261E" } : { background: "#EAF5DD", color: "#3F7A1F" }}>{c.trust === "suspicious" ? "مشبوه" : "جاد"}</span> : null}
                  </button>
                );
              })}
              {shown.length === 0 ? <div className="hm-empty">مفيش عملاء بالبحث ده.</div> : null}
            </div>
          </section>

          <section className="ad-card" aria-label="بيانات العميل" style={{ flex: "2 1 480px", minWidth: 0, gap: 16 }}>
            {cur && h ? (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <h2 style={{ margin: 0, fontSize: 22, overflowWrap: "anywhere" }}>{cur.full_name || "—"}</h2>
                    <div className="hm-sub"><span dir="ltr">{cur.phone || "—"}</span> · <span dir="ltr">{cur.email}</span> · {cur.governorate || "—"}{cur.account_type ? ` · ${ACCOUNT[cur.account_type]}` : ""} · اتسجل {day(cur.created_at)}</div>
                  </div>
                  {cur.phone ? (
                    <a href={wa(`أهلاً ${cur.full_name ?? ""}، معاك استعمال طبيب.`, realPhone(cur.phone))} target="_blank" rel="noopener noreferrer" className="ad-btn ad-sec" style={{ color: "#156B35" }}>كلّمه على واتساب ↗</a>
                  ) : null}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 14 }}>
                  <span className="hm-sub">تقييم الحساب:</span>
                  {cur.trust ? <span className="hm-pill" style={cur.trust === "suspicious" ? { background: "#FBE9E7", color: "#B3261E" } : { background: "#EAF5DD", color: "#3F7A1F" }}>{cur.trust === "suspicious" ? "مشبوه" : "جاد"}</span> : <span>مش متقيّم</span>}
                  {isAdmin ? (
                    <>
                      {cur.trust !== "serious" ? <button type="button" className="ad-btn ad-sec" onClick={() => void flag("serious")}>علّمه «جاد»</button> : null}
                      {cur.trust !== "suspicious" ? <button type="button" className="ad-btn ad-sec" style={{ color: "#B3261E" }} onClick={() => void flag("suspicious")}>علّمه «مشبوه»</button> : null}
                      {cur.trust ? <button type="button" className="ad-btn ad-sec" onClick={() => void flag(null)}>شيل التقييم</button> : null}
                    </>
                  ) : null}
                </div>

                {isAdmin ? (
                  <div>
                    <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>طلبات البيع ({h.subs.length})</h3>
                    <div className="hm-items">
                      {h.subs.map((s) => (
                        <Link key={s.id} href={`${routes.admin.submissions}?open=${encodeURIComponent(s.id)}`} className="hm-item">
                          <span style={{ minWidth: 0 }}><b>{s.id}</b> · {s.details} <span className="hm-sub">· {s.createdAt}</span></span>
                          <span className="hm-pill" style={{ background: "#F5F7F4", color: "#3C4C48" }}>{{ new: "جديد", follow_up: "محتاج متابعة", accepted: "اتقبل", rejected: "اترفض" }[s.status]}</span>
                        </Link>
                      ))}
                      {!h.subs.length ? <div className="hm-empty">مفيش.</div> : null}
                    </div>
                  </div>
                ) : null}

                <div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>طلبات الشراء ({h.ords.length})</h3>
                  <div className="hm-items">
                    {h.ords.map((o) => (
                      <Link key={o.id} href={`${routes.admin.orders}?open=${encodeURIComponent(o.id)}`} className="hm-item">
                        <span style={{ minWidth: 0 }}><b>{o.id}</b> · {o.device} <span className="hm-sub">· {o.date}</span></span>
                        <span className="hm-pill" style={{ background: "#F5F7F4", color: "#3C4C48" }}>{o.status === "active" ? (o.step >= 7 ? "اتقفل" : ORDER_STEPS[o.step]) : o.status === "returned" ? "مرتجع" : "اتلغى"}</span>
                      </Link>
                    ))}
                    {!h.ords.length ? <div className="hm-empty">مفيش.</div> : null}
                  </div>
                </div>

                <div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>«اطلب جهاز» ({h.reqs.length})</h3>
                  <div className="hm-items">
                    {h.reqs.map((r) => (
                      <Link key={r.id} href={`${routes.admin.requests}?open=${encodeURIComponent(r.id)}`} className="hm-item">
                        <span style={{ minWidth: 0 }}><b>{r.id}</b> · {typeLabel(r.deviceType)} <span className="hm-sub">· {r.createdAt}</span></span>
                        <span className="hm-pill" style={{ background: "#F5F7F4", color: "#3C4C48" }}>{{ new: "جديد", notified: "اتبلّغ", closed: "مقفول" }[r.status]}</span>
                      </Link>
                    ))}
                    {!h.reqs.length ? <div className="hm-empty">مفيش.</div> : null}
                  </div>
                </div>

                <div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>ملاحظات الفريق</h3>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <textarea className="ad-in" value={note} onChange={(e) => setNote(e.target.value)} placeholder="ملخص المكالمة أو الواتساب: اتكلمنا في إيه، واتفقنا على إيه" aria-label="ملاحظة جديدة" style={{ flex: "1 1 260px", minHeight: 70 }} />
                    <button type="button" className="ad-btn ad-pri" onClick={() => void addNote()} disabled={!note.trim()} style={{ alignSelf: "flex-start" }}>أضف</button>
                  </div>
                  {msg ? <div role="alert" className="ad-hint" style={{ color: "#B3261E" }}>{msg}</div> : null}
                  <ol style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {notes.map((n) => (
                      <li key={n.id} style={{ padding: "10px 14px", borderRadius: 12, background: "#F5F7F4" }}>
                        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{n.body}</div>
                        <div className="hm-sub">{whenAr(n.created_at)} · {n.author?.full_name || "الفريق"}</div>
                      </li>
                    ))}
                    {!notes.length ? <li className="hm-empty">لسه مفيش ملاحظات.</li> : null}
                  </ol>
                </div>
              </>
            ) : (
              <div className="hm-empty">اختار عميل من القايمة.</div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
