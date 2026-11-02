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

export default function HomePage() {
  return (
    <div className="mn-page">
      <MainArt />
      <BrowseArt />
      <Categories />
      <Hero />
      <Rows />
      <Featured />
      <SellQuick />
    </div>
  );
}
