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
import { Rows } from "./_home/Rows";

export default function HomePage() {
  return (
    <div className="mn-page hm-page">
      <MainArt />
      <BrowseArt />
      {/* Hero first, then the category tiles (Adel, Nov 2026 — replaces §76), rows, devices, quick sell box. How-it-works lives on /how. */}
      <Hero />
      <Categories />
      <Rows />
      <Featured />
      <SellBuy />
    </div>
  );
}
