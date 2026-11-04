"use client";

// Swipeable product rows on the home page (client, Nov 2026 — «more products on
// screen and more kinds of sections», like big shopping apps):
// «فرصة متتفوتش» = devices with an old price (السعر قبل الخصم), biggest discount
// first; then «وصل جديد», «تم الفحص», «أقل من 10,000 ج.م».
import Link from "next/link";
import { discountPct } from "@/components/site/Price";
import { isListed, useDemo } from "@/lib/demo/store";
import type { Device } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { DeviceCard } from "./Featured";

const MAX = 10;
const CHEAP = 10000;

type RowDef = { id: string; title: string; sub?: string; tone?: "deal"; pick: (all: Device[]) => Device[]; more?: string };

const ROWS: RowDef[] = [
  {
    id: "deals",
    title: "فرصة متتفوتش",
    sub: "أسعار نازلة لفترة محدودة",
    tone: "deal",
    pick: (all) => all.filter((d) => discountPct(d) > 0).sort((a, b) => discountPct(b) - discountPct(a)),
  },
  { id: "new", title: "وصل جديد", pick: (all) => all, more: `${routes.devices}?sort=new` },
  { id: "inspected", title: "تم الفحص", sub: "اتفحصت قبل ما تتعرض، وتقرير الفحص جوه", pick: (all) => all.filter((d) => d.inspection === "inspected"), more: `${routes.devices}?st=done` },
  { id: "cheap", title: "أقل من 10,000 ج.م", pick: (all) => all.filter((d) => d.price < CHEAP).sort((a, b) => a.price - b.price), more: `${routes.devices}?pmax=${CHEAP}` },
];

function Row({ def, items }: { def: RowDef; items: Device[] }) {
  return (
    <section className={def.tone === "deal" ? "mn-row-sec mn-row-deal" : "mn-row-sec"} aria-labelledby={`mn-row-${def.id}`}>
      <div className="mn-row-head">
        <div style={{ minWidth: 0 }}>
          <h2 id={`mn-row-${def.id}`} className="mn-row-h">
            {def.tone === "deal" ? (
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
              </svg>
            ) : null}
            {def.title}
          </h2>
          {def.sub ? <p className="mn-row-sub">{def.sub}</p> : null}
        </div>
        {def.more ? (
          <Link href={def.more} className="mn-row-more">
            شوف الكل ←
          </Link>
        ) : null}
      </div>
      <ul className="mn-row">
        {items.map((d) => (
          <li key={d.id}>
            <DeviceCard d={d} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Rows() {
  const { state, ready } = useDemo();
  if (!ready) return null;
  const listed = state.devices.filter(isListed);
  return (
    <div className="mn-rows">
      {ROWS.map((def) => {
        const items = def.pick(listed).slice(0, MAX);
        return items.length ? <Row key={def.id} def={def} items={items} /> : null;
      })}
    </div>
  );
}
