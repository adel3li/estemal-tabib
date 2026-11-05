import type { Metadata } from "next";
import "./styles.css";
import { DeviceClient } from "./DeviceClient";
import { CONDITIONS, fmt, typeLabel } from "@/lib/demo/labels";
import { isPublic } from "@/lib/devices/visibility";
import { getPublicData } from "@/lib/public/data";
import { PublicSeed } from "@/lib/public/seed";

// Rebuilt at most every 30 s; the browser then loads the live listing.
export const revalidate = 30;
// No pages built ahead; each listing page is made on its first visit, then reused for 30 s.
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

async function findDevice(raw: string) {
  const id = decodeURIComponent(raw);
  const data = await getPublicData();
  const d = data.devices.find((x) => x.id === id);
  return { data, d: d && isPublic(d) ? d : undefined };
}

/** Title, description and photo for Google and for link previews (WhatsApp, Facebook). */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { d } = await findDevice((await params).id);
  if (!d) return { title: "تفاصيل الجهاز" };
  const title = `${d.title} — ${fmt(d.price)} ج.م`;
  const bits = [
    typeLabel(d.type),
    `الحالة: ${CONDITIONS[d.condition].short}`,
    d.inspection === "inspected" ? "تم الفحص" : "يُفحص عند الطلب",
    `ضمان صيانة ${d.maintenanceMonths} شهور`,
    d.status === "reserved" ? "محجوز" : d.status === "sold" ? "تم البيع" : null,
  ].filter(Boolean);
  const description = `${bits.join(" · ")}. فلوسك محفوظة لحد ما تستلم وتجرّب.`;
  const cover = d.photos?.[0];
  return {
    title,
    description,
    alternates: { canonical: `/devices/${encodeURIComponent(d.id)}` },
    openGraph: { title, description, type: "website", locale: "ar_EG", siteName: "استعمال طبيب", url: `/devices/${encodeURIComponent(d.id)}`, images: cover ? [{ url: cover, alt: d.title }] : [{ url: "/apple-icon.png", width: 180, height: 180, alt: "استعمال طبيب" }] },
    twitter: { card: cover ? "summary_large_image" : "summary", title, description, ...(cover ? { images: [cover] } : {}) },
  };
}

export default async function Page({ params }: Props) {
  const { data, d } = await findDevice((await params).id);
  return (
    <PublicSeed devices={d ? [d] : []} categories={data.categories}>
      <DeviceClient />
    </PublicSeed>
  );
}
