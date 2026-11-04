"use client";

// «الطلب على الأجهزة» — market demand for the marketing team (docs/ADMIN_SPEC.md
// §1, open point B): most viewed and most saved listings, and the device types
// people ask for in «اطلب جهاز». No money here. Not in the design files —
// built from the admin card/table styles.
import Link from "next/link";
import { useEffect, useState } from "react";
import { BUSINESS } from "@/config/business";
import { DEVICE_TYPES, fmt, typeLabel } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import type { DeviceType } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { supabaseBrowser } from "@/lib/supabase/client";
import "../home.css";

type Stat = { public_code: string; title: string; type: DeviceType; status: string; views: number; saves: number };

function Top({ title, rows, metric, unit }: { title: string; rows: Stat[]; metric: "views" | "saves"; unit: string }) {
  const max = Math.max(1, ...rows.map((r) => r[metric]));
  return (
    <section className="ad-card hm-q" aria-label={title}>
      <h2 className="ad-h" style={{ fontWeight: 700 }}>{title}</h2>
      {rows.length ? (
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((r, i) => (
            <li key={r.public_code} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 14 }}>
                <Link href={routes.device(r.public_code)} style={{ color: "#12221F", fontWeight: 600, overflowWrap: "anywhere" }}>
                  {i + 1}. {r.title} <span className="hm-sub">({r.public_code} · {typeLabel(r.type)})</span>
                </Link>
                <b style={{ whiteSpace: "nowrap" }}>{fmt(r[metric])} {unit}</b>
              </span>
              <span aria-hidden="true" style={{ height: 6, borderRadius: 999, background: "#E5EBE8" }}>
                <span style={{ display: "block", height: "100%", width: `${(r[metric] / max) * 100}%`, borderRadius: 999, background: "#0D5C55" }} />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="hm-empty">لسه مفيش بيانات.</div>
      )}
    </section>
  );
}

export default function DemandPage() {
  const { ready, state } = useDemo();
  const [stats, setStats] = useState<Stat[] | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let alive = true;
    supabaseBrowser()
      .rpc("demand_stats")
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setErr(true);
        else setStats((data as Stat[]).map((s) => ({ ...s, saves: Number(s.saves) })));
      });
    return () => {
      alive = false;
    };
  }, []);

  const views = [...(stats ?? [])].filter((s) => s.views > 0).sort((a, b) => b.views - a.views).slice(0, 10);
  const saves = [...(stats ?? [])].filter((s) => s.saves > 0).sort((a, b) => b.saves - a.saves).slice(0, 10);

  // «اطلب جهاز» by type: how many ask, how many still waiting, what's on sale now.
  const byType = DEVICE_TYPES.map(({ id }) => {
    const reqs = state.requests.filter((r) => r.deviceType === id);
    const onSale = state.devices.filter((d) => d.type === id && d.status === "published");
    return { id, total: reqs.length, open: reqs.filter((r) => r.status === "new").length, onSale: onSale.length };
  })
    .filter((t) => t.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <>
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الطلب على الأجهزة</div>
        <h1 className="hm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>الطلب على الأجهزة</h1>
        <div style={{ color: "#4A5A56" }}>إيه الأجهزة اللي الناس بتتفرج عليها وبتحفظها، وإيه الأنواع اللي بيطلبوها في «اطلب جهاز» — عشان نعرف ندوّر على إيه ونعلن عن إيه.</div>
      </div>

      {!ready || (!stats && !err) ? (
        <div className="ad-card" role="status" style={{ minHeight: 160, alignItems: "center", justifyContent: "center", color: "#4A5A56" }}>بنحمّل…</div>
      ) : (
        <>
          {err ? <div role="alert" className="ad-card" style={{ color: "#7A1A14" }}>ما قدرناش نحمّل المشاهدات والحفظ. حدّث الصفحة.</div> : null}
          <section className="ad-card" aria-labelledby="dm-types" style={{ gap: 12 }}>
            <h2 className="ad-h" id="dm-types" style={{ fontWeight: 700 }}>الأنواع الأكثر طلباً في «اطلب جهاز»</h2>
            {byType.length ? (
              <div className="hm-tbl hm-nomoney" role="table" aria-label="الطلب حسب نوع الجهاز">
                <div className="hm-tr hm-th" role="row" style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr" }}>
                  {["نوع الجهاز", "كل الطلبات", "لسه مستنيين", "معروض دلوقتي"].map((h) => <span key={h} role="columnheader">{h}</span>)}
                </div>
                {byType.map((t) => (
                  <div key={t.id} className="hm-tr" role="row" style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr" }}>
                    <b role="cell">{typeLabel(t.id)}</b>
                    <span role="cell" data-l="كل الطلبات">{t.total}</span>
                    <span role="cell" data-l="لسه مستنيين" style={{ color: t.open ? "#8A4209" : undefined, fontWeight: t.open ? 700 : 400 }}>{t.open}</span>
                    <span role="cell" data-l="معروض دلوقتي">{t.onSale}{t.open && !t.onSale ? " — دوّر على جهاز" : ""}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="hm-empty">لسه مفيش طلبات «اطلب جهاز».</div>
            )}
            <div className="ad-hint">الجهاز المناسب = نفس النوع، وسعره في ميزانية العميل أو أعلى منها لحد {Math.round(BUSINESS.requestBudgetSlack * 100)}%.</div>
          </section>
          <div className="hm-queue">
            <Top title="الأكثر مشاهدة" rows={views} metric="views" unit="مشاهدة" />
            <Top title="الأكثر حفظاً (المفضلة)" rows={saves} metric="saves" unit="حفظ" />
          </div>
        </>
      )}
    </>
  );
}
