"use client";

// /devices/[id] — v2 direction (design-explorations/v2/src/listing.html, brand theme):
// gallery + sticky buy column, then the report (or the on-order steps) next to the specs.
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { isPublic, useDemo } from "@/lib/demo/store";
import { typeLabel } from "@/lib/demo/labels";
import { routes } from "@/lib/routes";
import { BrowseArt } from "../art";
import { DeviceArt } from "./art";
import { DataGrid } from "./DataGrid";
import { Gallery } from "./Gallery";
import { OrderBar } from "./OrderBar";
import { PriceCard } from "./PriceCard";
import { Report } from "./Report";
import { Steps } from "./Steps";

function NotFound() {
  return (
    <section className="hm-page hm-wrap" style={{ padding: "56px 20px 80px" }}>
      <div className="li-empty">
        <h1>الجهاز ده مش متاح</h1>
        <p>ممكن يكون اتشال أو الرابط غلط. شوف الأجهزة المتاحة دلوقتي.</p>
        <Link href={routes.devices} className="hm-btn li-btn-brand">كل الأجهزة</Link>
      </div>
    </section>
  );
}

export function DeviceClient() {
  const params = useParams<{ id: string }>();
  const { getDevice } = useDemo();
  const id = typeof params.id === "string" ? params.id : "";
  const d = getDevice(id);
  // Discount code typed on the price card; both order buttons send it.
  const [promo, setPromo] = useState("");

  if (!d || !isPublic(d)) return <NotFound />;
  const inspected = d.inspection === "inspected";

  return (
    <div className="hm-page li-page">
      <BrowseArt />
      <DeviceArt />

      <div className="hm-wrap">
        <nav className="li-crumbs" aria-label="مسار الصفحة">
          <Link href={routes.home}>الرئيسية</Link>
          <span aria-hidden="true">/</span>
          <Link href={routes.devices}>كل الأجهزة</Link>
          <span aria-hidden="true">/</span>
          <Link href={`${routes.devices}?cat=${d.type}`}>{typeLabel(d.type)}</Link>
          <span aria-hidden="true">/</span>
          <b>{d.title}</b>
        </nav>

        <section className="li-pdp">
          <div className="li-gal">
            <Gallery key={d.id} d={d} />
          </div>
          <aside className="li-aside">
            <PriceCard d={d} promo={promo} onPromo={setPromo} />
          </aside>
        </section>

        <section className="li-two">
          <div style={{ minWidth: 0 }}>{inspected ? <Report d={d} /> : <Steps />}</div>
          <div style={{ minWidth: 0 }}>
            <DataGrid d={d} />
          </div>
        </section>
      </div>
      <OrderBar d={d} promo={promo} />
    </div>
  );
}
