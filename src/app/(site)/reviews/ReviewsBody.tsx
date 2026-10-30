"use client";

// Phase 1: no reviews backend. The cards are placeholders until the first real
// reviews come in, and the form sends a review to the team on WhatsApp; the team
// publishes it after checking it's from a real order.
import { useState } from "react";
import { waLink } from "@/lib/whatsapp";

type Role = "buyer" | "seller";

const PLACEHOLDERS: { role: Role; device: string }[] = [
  { role: "buyer", device: "[الجهاز]" },
  { role: "seller", device: "[الجهاز]" },
  { role: "buyer", device: "[الجهاز]" },
];

const ROLE_TEXT: Record<Role, string> = { buyer: "اشترى", seller: "باع" };

function Stars({ n, size = 18 }: { n: number; size?: number }) {
  return (
    <span aria-label={`${n} من 5`} role="img" style={{ display: "inline-flex", gap: 2, color: "#F2A33A" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={i <= n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewsBody() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("buyer");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const ready = rating > 0 && text.trim().length > 0;

  const message = [
    "تقييم لـ «استعمال طبيب»",
    `الاسم: ${name.trim() || "-"}`,
    `أنا: ${role === "buyer" ? "اشتريت جهاز" : "بعت جهاز"}`,
    `التقييم: ${rating} من 5`,
    `رأيي: ${text.trim()}`,
  ].join("\n");

  return (
    <>
      <section className="rv-head">
        <div className="mn-sec" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          <div style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <h1 className="mn-h2" style={{ margin: 0, fontWeight: 700 }}>آراء الدكاترة</h1>
            <p className="mn-lead" style={{ margin: 0, color: "#4A5A56" }}>تجارب دكاترة اشتروا وباعوا أجهزتهم على استعمال طبيب.</p>
          </div>
          <div className="rv-score">
            <span style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}>[التقييم]</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Stars n={5} />
              <span style={{ fontSize: 14, color: "#4A5A56" }}>من [عدد] تقييم</span>
            </span>
          </div>
        </div>
      </section>

      <section className="mn-sec" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
        <ul className="rv-grid">
          {PLACEHOLDERS.map((r, i) => (
            <li key={i} className="rv-card">
              <Stars n={5} />
              <p style={{ margin: 0, fontSize: 17 }}>«[رأي الدكتور في تجربته]»</p>
              <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid #E5EBE8", display: "flex", alignItems: "center", gap: 12 }}>
                <span aria-hidden="true" className="rv-avatar">د</span>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 700 }}>د. [الاسم]</span>
                  <span style={{ fontSize: 14, color: "#4A5A56" }}>{ROLE_TEXT[r.role]} {r.device}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>

        <form className="rv-form" onSubmit={(e) => e.preventDefault()} aria-labelledby="rv-form-title">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h2 id="rv-form-title" style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>اكتب رأيك</h2>
            <p style={{ margin: 0, color: "#4A5A56" }}>اشتريت أو بعت جهاز على الموقع؟ قولنا تجربتك. بننشر الرأي بعد ما نراجعه.</p>
          </div>
          <div className="rv-row">
            <label className="rv-field">
              اسمك
              <input className="rv-in" value={name} onChange={(e) => setName(e.target.value)} placeholder="د. …" autoComplete="name" enterKeyHint="next" />
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
            رأيك
            <textarea className="rv-in" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="الجهاز وصل زي التقرير؟ التعامل كان عامل إزاي؟" />
          </label>
          {ready ? (
            <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="rv-send">ابعت رأيك على واتساب</a>
          ) : (
            <button type="button" disabled className="rv-send">اختار التقييم واكتب رأيك</button>
          )}
        </form>
      </section>
    </>
  );
}
