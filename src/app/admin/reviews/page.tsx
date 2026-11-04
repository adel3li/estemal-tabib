"use client";

// «الآراء» — reviews sent from the site wait here; the team publishes, hides
// or deletes them, and adds reviews from past customers (client, WhatsApp
// 3–4 Nov 2026). Team page (admin + marketing). Not in the design files.
import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { whenAr } from "@/lib/submissions/db";
import "../home.css";

type Status = "pending" | "published" | "hidden";
type Row = { id: number; author_name: string; role: "buyer" | "seller"; rating: number; body: string; device: string | null; status: Status; source: "site" | "team"; published_at: string | null; created_at: string };

const TABS: [Status, string][] = [["pending", "مستني المراجعة"], ["published", "منشور"], ["hidden", "مخفي"]];
const ROLE = { buyer: "اشترى", seller: "باع" } as const;
const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default function ReviewsAdmin() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [tab, setTab] = useState<Status>("pending");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  // «أضف رأي» (past customers)
  const [name, setName] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [rating, setRating] = useState(5);
  const [device, setDevice] = useState("");
  const [body, setBody] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabaseBrowser()
      .from("reviews")
      .select("id, author_name, role, rating, body, device, status, source, published_at, created_at")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as Row[]);
    window.dispatchEvent(new Event("reviews-changed"));
  }, []);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const act = async (r: Row, status: Status | "delete") => {
    setBusy(true);
    const sb = supabaseBrowser();
    const { error } = status === "delete" ? await sb.from("reviews").delete().eq("id", r.id) : await sb.from("reviews").update({ status }).eq("id", r.id);
    setBusy(false);
    if (error) {
      setMsg("ما قدرناش نحفظ. جرّب تاني.");
      return;
    }
    setMsg(status === "published" ? `رأي ${r.author_name} اتنشر على الموقع.` : status === "hidden" ? `رأي ${r.author_name} اتخفى.` : status === "delete" ? "الرأي اتمسح." : "رجع «مستني المراجعة».");
    await load();
  };

  const add = async () => {
    if (name.trim().length < 2 || body.trim().length < 5) {
      setMsg("اكتب اسم العميل ورأيه.");
      return;
    }
    setBusy(true);
    const { error } = await supabaseBrowser()
      .from("reviews")
      .insert({ author_name: name.trim(), role, rating, body: body.trim(), device: device.trim() || null, status: "published", source: "team" });
    setBusy(false);
    if (error) {
      setMsg("ما قدرناش نضيف الرأي. جرّب تاني.");
      return;
    }
    setName("");
    setDevice("");
    setBody("");
    setRating(5);
    setMsg("الرأي اتضاف واتنشر على صفحة «آراء العملاء».");
    setTab("published");
    await load();
  };

  const list = (rows ?? []).filter((r) => r.status === tab);
  const count = (s: Status) => (rows ?? []).filter((r) => r.status === s).length;

  return (
    <>
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الآراء</div>
        <h1 className="hm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>آراء العملاء</h1>
        <div style={{ color: "#4A5A56" }}>الآراء اللي بتتبعت من الموقع بتستنى هنا لحد ما تراجعها وتنشرها. وتقدر تضيف آراء عملاء اتعاملوا معاك قبل كده.</div>
      </div>

      {msg ? <div role="status" style={{ padding: "12px 16px", borderRadius: 14, background: "#EAF5DD", color: "#2F5E16", fontWeight: 600 }}>{msg}</div> : null}

      <section className="ad-card" aria-labelledby="rv-add" style={{ gap: 12 }}>
        <h2 className="ad-h" id="rv-add" style={{ fontWeight: 700 }}>أضف رأي عميل</h2>
        <div className="ad-grid">
          <label className="ad-field">
            اسم العميل
            <input type="text" className="ad-in" value={name} onChange={(e) => setName(e.target.value)} placeholder="د. …" maxLength={80} />
          </label>
          <label className="ad-field">
            هو
            <select className="ad-in" value={role} onChange={(e) => setRole(e.target.value as "buyer" | "seller")}>
              <option value="buyer">اشترى جهاز</option>
              <option value="seller">باع جهاز</option>
            </select>
          </label>
          <label className="ad-field">
            التقييم
            <select className="ad-in" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{stars(n)} ({n})</option>)}
            </select>
          </label>
          <label className="ad-field">
            الجهاز (اختياري)
            <input type="text" className="ad-in" value={device} onChange={(e) => setDevice(e.target.value)} placeholder="مثال: يونيت أسنان" maxLength={120} />
          </label>
        </div>
        <label className="ad-field">
          رأيه
          <textarea className="ad-in" value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} style={{ minHeight: 80 }} placeholder="زي ما قاله بالظبط" />
        </label>
        <div><button type="button" className="ad-btn ad-pri" disabled={busy} onClick={() => void add()}>أضف وانشر</button></div>
      </section>

      <section className="ad-card" aria-label="الآراء" style={{ gap: 12 }}>
        <div role="tablist" aria-label="حالة الرأي" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TABS.map(([k, l]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} className="ad-chip" onClick={() => setTab(k)} style={{ border: `1px solid ${tab === k ? "#0D5C55" : "#C9D4CF"}`, background: tab === k ? "#0D5C55" : "#FFFFFF", color: tab === k ? "#FFFFFF" : "#12221F" }}>
              {l} ({count(k)})
            </button>
          ))}
        </div>
        {!rows ? (
          <div role="status" className="hm-empty">بنحمّل…</div>
        ) : list.length ? (
          <div className="hm-items">
            {list.map((r) => (
              <div key={r.id} className="hm-item" style={{ alignItems: "flex-start", flexWrap: "wrap", cursor: "default" }}>
                <span style={{ flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 4, lineHeight: 1.5 }}>
                  <span style={{ color: "#C46A12", letterSpacing: 1 }} aria-label={`${r.rating} من 5`}>{stars(r.rating)}</span>
                  <span style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>«{r.body}»</span>
                  <span className="hm-sub">
                    {r.author_name} · {ROLE[r.role]} {r.device || "جهاز"} · {r.source === "team" ? "ضافه الفريق" : "من الموقع"} · {whenAr(r.created_at)}
                  </span>
                </span>
                <span style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {r.status !== "published" ? <button type="button" className="ad-btn ad-pri" disabled={busy} onClick={() => void act(r, "published")}>انشره</button> : null}
                  {r.status !== "hidden" ? <button type="button" className="ad-btn ad-sec" disabled={busy} onClick={() => void act(r, "hidden")}>اخفيه</button> : null}
                  <button type="button" className="ad-btn ad-sec" style={{ color: "#B3261E" }} disabled={busy} onClick={() => { if (window.confirm("تمسح الرأي ده نهائياً؟")) void act(r, "delete"); }}>امسحه</button>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="hm-empty">{tab === "pending" ? "مفيش آراء مستنية المراجعة." : "مفيش آراء هنا."}</div>
        )}
      </section>
    </>
  );
}
