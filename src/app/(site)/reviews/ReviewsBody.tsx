"use client";

// Reviews (table `reviews`): the page shows the published ones; the form saves
// a new one as «مستني المراجعة» and the team publishes it from «الآراء» in the
// dashboard after checking it's from a real deal (client, WhatsApp 4 Nov 2026).
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SUPABASE_URL } from "@/lib/supabase/env";

type Role = "buyer" | "seller";

export type Review = { id: number; author_name: string; role: Role; rating: number; body: string; device: string | null; published_at: string | null };

const ROLE_TEXT: Record<Role, string> = { buyer: "اشترى", seller: "باع" };

function Stars({ n, size = 18 }: { n: number; size?: number }) {
  return (
    <span aria-label={`${n} من 5`} role="img" style={{ display: "inline-flex", gap: 2, color: "#F5921C" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={i <= n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewsBody() {
  const [list, setList] = useState<Review[] | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("buyer");
  const [rating, setRating] = useState(0);
  const [device, setDevice] = useState("");
  const [text, setText] = useState("");
  const [state, setState] = useState<"" | "sending" | "sent" | "error">("");
  const ready = rating > 0 && name.trim().length >= 2 && text.trim().length >= 5;

  useEffect(() => {
    if (!SUPABASE_URL) {
      void Promise.resolve().then(() => setList([]));
      return;
    }
    supabaseBrowser()
      .from("reviews")
      .select("id, author_name, role, rating, body, device, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(60)
      .then(({ data }) => setList((data ?? []) as Review[]));
  }, []);

  const send = async () => {
    if (!ready || state === "sending") return;
    setState("sending");
    // No .select(): a pending review isn't readable by the sender (RLS).
    const { error } = await supabaseBrowser()
      .from("reviews")
      .insert({ author_name: name.trim(), role, rating, body: text.trim(), device: device.trim() || null });
    if (error) {
      setState("error");
      return;
    }
    setState("sent");
    setName("");
    setRating(0);
    setDevice("");
    setText("");
  };

  const avg = list && list.length ? list.reduce((a, r) => a + r.rating, 0) / list.length : 0;

  return (
    <>
      <section className="rv-head">
        <div className="mn-sec" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          <div style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <h1 className="mn-h2" style={{ margin: 0, fontWeight: 700 }}>آراء الدكاترة</h1>
            <p className="mn-lead" style={{ margin: 0, color: "#4A595A" }}>تجارب دكاترة اشتروا وباعوا أجهزتهم على استعمال طبيب.</p>
          </div>
          <div className="rv-score">
            <span style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}>{list && list.length ? avg.toFixed(1) : "—"}</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Stars n={Math.round(avg) || 5} />
              <span style={{ fontSize: 14, color: "#4A595A" }}>{list && list.length ? `من ${list.length} تقييم` : "لسه مفيش تقييمات"}</span>
            </span>
          </div>
        </div>
      </section>

      <section className="mn-sec" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
        {list === null ? (
          <div role="status" style={{ color: "#4A595A" }}>بنحمّل الآراء…</div>
        ) : list.length ? (
          <ul className="rv-grid">
            {list.map((r) => (
              <li key={r.id} className="rv-card">
                <Stars n={r.rating} />
                <p style={{ margin: 0, fontSize: 17, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>«{r.body}»</p>
                <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid #E5EBEA", display: "flex", alignItems: "center", gap: 12 }}>
                  <span aria-hidden="true" className="rv-avatar">{r.author_name.replace(/^د\.\s*/, "").trim().charAt(0) || "د"}</span>
                  <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, overflowWrap: "anywhere" }}>{r.author_name}</span>
                    <span style={{ fontSize: 14, color: "#4A595A" }}>{ROLE_TEXT[r.role]} {r.device || "جهاز"}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ padding: 24, borderRadius: 12, background: "#FFFFFF", border: "1px solid #DFE7EA", color: "#4A595A", textAlign: "center" }}>
            لسه مفيش آراء منشورة. اشتريت أو بعت جهاز معانا؟ كن أول واحد يكتب رأيه.
          </div>
        )}

        <form
          className="rv-form"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          aria-labelledby="rv-form-title"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h2 id="rv-form-title" style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>اكتب رأيك</h2>
            <p style={{ margin: 0, color: "#4A595A" }}>اشتريت أو بعت جهاز على الموقع؟ قولنا تجربتك. بننشر الرأي بعد ما نراجعه.</p>
          </div>
          <div className="rv-row">
            <label className="rv-field">
              اسمك
              <input className="rv-in" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="د. …" autoComplete="name" enterKeyHint="next" />
            </label>
            <fieldset className="rv-field" style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
              <legend style={{ padding: 0, marginBottom: 6 }}>أنا</legend>
              <div style={{ display: "flex", gap: 8 }}>
                {(["buyer", "seller"] as Role[]).map((r) => (
                  <label key={r} className={role === r ? "rv-pill is-on" : "rv-pill"}>
                    <input type="radio" name="rv-role" checked={role === r} onChange={() => setRole(r)} />
                    {r === "buyer" ? "اشتريت جهاز" : "بعت جهاز"}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <fieldset className="rv-field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ padding: 0, marginBottom: 6 }}>تقييمك</legend>
            <div className="rv-rate">
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className={n <= rating ? "rv-star is-on" : "rv-star"}>
                  <input type="radio" name="rv-rating" value={n} checked={rating === n} onChange={() => setRating(n)} aria-label={`${n} من 5`} />
                  <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
                    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
                  </svg>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="rv-field">
            الجهاز (اختياري)
            <input className="rv-in" value={device} onChange={(e) => setDevice(e.target.value)} placeholder="مثال: أوتوكلاف Class B" maxLength={120} enterKeyHint="next" />
          </label>
          <label className="rv-field">
            رأيك
            <textarea className="rv-in" rows={4} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} placeholder="الجهاز وصل زي التقرير؟ التعامل كان عامل إزاي؟" />
          </label>
          {state === "sent" ? (
            <div role="status" style={{ padding: "12px 16px", borderRadius: 14, background: "#EAF5DD", color: "#2F5E16", fontWeight: 600 }}>
              شكراً! وصلنا رأيك، وهيظهر هنا بعد ما نراجعه.
            </div>
          ) : null}
          {state === "error" ? (
            <div role="alert" style={{ padding: "12px 16px", borderRadius: 14, background: "#FBE9E7", color: "#7A1A14", fontWeight: 600 }}>
              ما قدرناش نبعت رأيك دلوقتي. جرّب تاني بعد شوية.
            </div>
          ) : null}
          <button type="submit" disabled={!ready || state === "sending"} className="rv-send">
            {state === "sending" ? "بنبعت…" : ready ? "ابعت رأيك" : "اكتب اسمك واختار التقييم واكتب رأيك"}
          </button>
        </form>
      </section>
    </>
  );
}
