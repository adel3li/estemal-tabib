// `/` — ported from design-reference/Main.dc.html (header/footer come from the layout).
// The other sections live on their own pages (header tabs): /how, /warranty, /faq, /reviews.
import "./_home/styles.css";
import { MainArt } from "./_home/art";
import { Hero } from "./_home/Hero";
import { Categories } from "./_home/Categories";
import { BrowseArt } from "./devices/art";
import { Featured } from "./_home/Featured";
import { Rows } from "./_home/Rows";
import { SellQuick } from "./_home/SellQuick";
import { getPublicData } from "@/lib/public/data";
import { PublicSeed } from "@/lib/public/seed";

// Rebuilt at most every 30 s with the current listings; the browser then loads the live list.
export const revalidate = 30;

export default async function HomePage() {
  const data = await getPublicData();
  return (
    <PublicSeed devices={data.devices} categories={data.categories}>
    <div className="mn-page">
      <MainArt />
      <BrowseArt />
      <Categories />
      <Hero />
      <Rows />
      <Featured />
      <SellQuick />
    </div>
    </PublicSeed>
  );
}
