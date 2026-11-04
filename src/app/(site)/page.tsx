// `/` — v2 direction (design-explorations/v2/src/home.html, brand theme); the
// header/footer come from the layout. The other sections live on their own
// pages (header tabs): /how, /warranty, /faq, /reviews.
import "./_home/styles.css";
import "./_home/v2.css";
import { MainArt } from "./_home/art";
import { Hero } from "./_home/Hero";
import { Categories } from "./_home/Categories";
import { BrowseArt } from "./devices/art";
import { Featured } from "./_home/Featured";
import { SellBuy } from "./_home/SellBuy";

export default function HomePage() {
  return (
    <div className="mn-page hm-page">
      <MainArt />
      <BrowseArt />
      {/* Category tiles first (client, §76), then hero, devices, quick sell box (§ header tabs: how-it-works lives on /how). */}
      <Categories />
      <Hero />
      <Featured />
      <SellBuy />
    </div>
  );
}
