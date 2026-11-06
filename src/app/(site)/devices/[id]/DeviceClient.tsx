"use client";

// /devices/[id] — v2 direction (design-explorations/v2/src/listing.html, brand theme):
// gallery + sticky buy column, then the report (or the on-order steps) next to the specs.
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DevicesLoading } from "@/components/site/DevicesLoading";
import { usePublicDevices } from "@/lib/public/seed";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SUPABASE_URL } from "@/lib/supabase/env";
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
  const { devices, ready, live, failed } = usePublicDevices();
  const store = useDemo();
  const devicesError = failed || store.devicesError;
  const id = typeof params.id === "string" ? decodeURIComponent(params.id) : "";
  const d = devices.find((x) => x.id === id);
  // Discount code typed on the price card; both order buttons send it.
  const [promo, setPromo] = useState("");

  // How many units (only shown when there are several).
  const [qty, setQty] = useState(1);
  const code = d && isPublic(d) ? d.id : null;

  // «الأكثر مشاهدة» (ADMIN_SPEC open point B): count one view per device per browser session.
  useEffect(() => {
    if (!code || !SUPABASE_URL) return;
    const key = `seen:${code}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked — count it anyway */
    }
    supabaseBrowser().rpc("count_device_view", { p_code: code }).then(({ error }) => { if (error) console.error("view count failed", error.message); });
  }, [code]);

  // The server's copy may not have a listing published seconds ago: wait for the live list before «not found».
  if (!ready || (devicesError && !d) || (!d && !live))
    return (
      <div className="hm-wrap" style={{ padding: "24px 20px 60px" }}>
        <DevicesLoading failed={devicesError} cards={1} />
      </div>
    );
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
            <PriceCard d={d} promo={promo} onPromo={setPromo} qty={qty} onQty={setQty} />
          </aside>
        </section>

        <section className="li-two">
          <div style={{ minWidth: 0 }}>{inspected ? <Report d={d} /> : <Steps />}</div>
          <div style={{ minWidth: 0 }}>
            <DataGrid d={d} />
          </div>
        </section>
      </div>
      <OrderBar d={d} promo={promo} qty={qty} />
    </div>
  );
}
