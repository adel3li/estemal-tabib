"use client";

// «الفريق» — Super Admin adds / removes team members (docs/ADMIN_SPEC.md §1,
// open point A). The person signs in to the site once (Google) so they have an
// account; then they're added here by email. Not in the design files.
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import "../home.css";

type Member = { id: string; full_name: string | null; email: string | null; role: "admin" | "marketing" };
type Role = Member["role"];

const ROLE: Record<Role, [string, string, string]> = {
  admin: ["المدير الأساسي", "#E3F0ED", "#0D5C55"],
  marketing: ["فريق التسويق والمتابعة", "#E6EDF7", "#24508F"],
};

const CAN: Record<Role, string> = {
  admin: "كل حاجة: إدخال البيانات، الموافقات المالية، الأرباح، تأكيد الطلبات، «اعتمد ونشّر»، والفريق.",
  marketing: "الرئيسية، متابعة الطلبات والشحن وتحديث حالتها، أرقام العملاء، طلبات «اطلب جهاز»، والطلب على الأجهزة — من غير أرباح أو مصاريف أو سجلات مالية.",
};

export default function TeamPage() {
  const { userId } = useAuth();
  const [list, setList] = useState<Member[] | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("marketing");
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabaseBrowser().from("profiles").select("id, full_name, email, role").in("role", ["admin", "marketing"]).order("role");
    setList((data ?? []) as Member[]);
  }, []);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const setTeamRole = async (who: string, r: Role | "user") => {
    setBusy(true);
    const { data, error } = await supabaseBrowser().rpc("set_team_role", { p_email: who, p_role: r });
    setBusy(false);
    if (error) {
      setMsg({
        ok: false,
        txt: /no account/.test(error.message)
          ? "مفيش حساب بالإيميل ده. خلّيه يسجّل دخول على الموقع بجوجل مرة الأول، وبعدين ضيفه."
          : /own role/.test(error.message)
            ? "مينفعش تغيّر دورك انت."
            : "ما قدرناش نحفظ. جرّب تاني.",
      });
      return false;
    }
    setMsg({ ok: true, txt: r === "user" ? `${data} اتشال من الفريق.` : `${data} بقى «${ROLE[r][0]}».` });
    await load();
    return true;
  };

  return (
    <>
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الفريق</div>
        <h1 className="hm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>الفريق</h1>
        <div style={{ color: "#4A5A56" }}>مين يقدر يدخل لوحة التحكم، وبأنهي صلاحيات.</div>
      </div>

      {msg ? (
        <div role="status" style={{ padding: "12px 16px", borderRadius: 14, background: msg.ok ? "#EAF5DD" : "#FBE9E7", color: msg.ok ? "#2F5E16" : "#7A1A14", fontWeight: 600 }}>{msg.txt}</div>
      ) : null}

      <section className="ad-card" aria-labelledby="tm-add" style={{ gap: 14 }}>
        <h2 className="ad-h" id="tm-add" style={{ fontWeight: 700 }}>ضيف حد للفريق</h2>
        <div className="ad-hint">الأول يسجّل دخول على الموقع بحساب جوجل بتاعه مرة واحدة، وبعدين اكتب الإيميل هنا.</div>
        <div className="ad-grid">
          <label className="ad-field">
            الإيميل
            <input type="email" className="ad-in" dir="ltr" style={{ textAlign: "right" }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@gmail.com" />
          </label>
          <label className="ad-field">
            الدور
            <select className="ad-in" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="marketing">{ROLE.marketing[0]}</option>
              <option value="admin">{ROLE.admin[0]}</option>
            </select>
          </label>
        </div>
        <div className="ad-hint">{CAN[role]}</div>
        <div>
          <button
            type="button"
            className="ad-btn ad-pri"
            disabled={busy || !email.includes("@")}
            onClick={async () => {
              if (await setTeamRole(email, role)) setEmail("");
            }}
          >
            ضيف
          </button>
        </div>
      </section>

      <section className="ad-card" aria-labelledby="tm-list" style={{ gap: 10 }}>
        <h2 className="ad-h" id="tm-list" style={{ fontWeight: 700 }}>
          الفريق دلوقتي <span className="hm-count">{list?.length ?? 0}</span>
        </h2>
        {!list ? (
          <div role="status" className="hm-empty">بنحمّل…</div>
        ) : (
          <div className="hm-items">
            {list.map((m) => {
              const [label, bg, fg] = ROLE[m.role];
              const me = m.id === userId;
              return (
                <div key={m.id} className="hm-item" style={{ cursor: "default" }}>
                  <span style={{ minWidth: 0, display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
                    <b style={{ overflowWrap: "anywhere" }}>{m.full_name || "—"}{me ? " (انت)" : ""}</b>
                    <span className="hm-sub" dir="ltr" style={{ textAlign: "right" }}>{m.email}</span>
                  </span>
                  <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                    <span className="hm-pill" style={{ background: bg, color: fg }}>{label}</span>
                    {!me && m.email ? (
                      <>
                        <button type="button" className="ad-btn ad-sec" disabled={busy} onClick={() => void setTeamRole(m.email!, m.role === "admin" ? "marketing" : "admin")}>
                          {m.role === "admin" ? "خلّيه فريق تسويق" : "خلّيه مدير أساسي"}
                        </button>
                        <button
                          type="button"
                          className="ad-btn ad-sec"
                          style={{ color: "#B3261E" }}
                          disabled={busy}
                          onClick={() => {
                            if (window.confirm(`تشيل ${m.full_name || m.email} من الفريق؟ مش هيقدر يدخل لوحة التحكم تاني.`)) void setTeamRole(m.email!, "user");
                          }}
                        >
                          شيله
                        </button>
                      </>
                    ) : null}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
