"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { isPublic, useDemo } from "@/lib/demo/store";
import { routes } from "@/lib/routes";
import { BrowseArt } from "../art";
import { DeviceArt } from "./art";
import { DataGrid } from "./DataGrid";
import { Gallery } from "./Gallery";
import { PriceCard } from "./PriceCard";
import { Report } from "./Report";
import { Steps } from "./Steps";

function NotFound() {
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px 80px" }}>
      <div style={{ padding: "48px 24px", borderRadius: 24, background: "#FFFFFF", border: "1px dashed #9FB2AB", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: 24 }}>الجهاز ده مش متاح</h1>
        <div style={{ color: "#4A5A56" }}>ممكن يكون اتشال أو الرابط غلط. شوف الأجهزة المتاحة دلوقتي.</div>
        <Link href={routes.devices} className="li-cta" style={{ minHeight: 48, padding: "0 22px", borderRadius: 12, background: "#0D5C55", color: "#FFFFFF", fontWeight: 700, display: "flex", alignItems: "center" }}>كل الأجهزة</Link>
      </div>
    </section>
  );
}

export function DeviceClient() {
  const params = useParams<{ id: string }>();
  const { getDevice } = useDemo();
  const id = typeof params.id === "string" ? params.id : "";
  const d = getDevice(id);

  if (!d || !isPublic(d)) return <NotFound />;
  const inspected = d.inspection === "inspected";

  return (
    <div>
      <BrowseArt />
      <DeviceArt />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px 0", fontSize: 14, color: "#4A5A56", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <Link href={routes.home}>الرئيسية</Link>
        <span aria-hidden="true">›</span>
        <Link href={routes.devices}>كل الأجهزة</Link>
        <span aria-hidden="true">›</span>
        <span>{d.title}</span>
      </div>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 20px 40px", display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
        <div style={{ flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          <Gallery key={d.id} d={d} />
          <DataGrid d={d} />
        </div>
        <aside style={{ flex: "1 1 380px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88 }}>
          <PriceCard d={d} />
        </aside>
      </section>

      {inspected ? <Report d={d} /> : <Steps />}
    </div>
  );
}
