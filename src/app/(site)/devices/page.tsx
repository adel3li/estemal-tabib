import type { Metadata } from "next";
import { Suspense } from "react";
import "../_home/v2.css";
import "./styles.css";
import { BrowseClient } from "./BrowseClient";
import { getPublicData } from "@/lib/public/data";
import { PublicSeed } from "@/lib/public/seed";

export const metadata: Metadata = {
  title: "كل الأجهزة",
  description: "أجهزة أسنان مستعملة متاحة دلوقتي: يونيت، أشعة، أوتوكلاف، موتور إندو وغيرها — كل جهاز بفحص وضمان صيانة مكتوب.",
  alternates: { canonical: "/devices" },
};

// Filters live in the URL, so the list is rendered per request (the data itself is cached 30 s).
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getPublicData();
  return (
    <PublicSeed devices={data.devices} categories={data.categories}>
      <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
        <BrowseClient />
      </Suspense>
    </PublicSeed>
  );
}
