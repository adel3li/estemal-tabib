// `/` — ported from design-reference/Main.dc.html (header/footer come from the layout).
// The other sections live on their own pages (header tabs): /how, /warranty, /faq, /reviews.
import "./_home/styles.css";
import { MainArt } from "./_home/art";
import { Hero } from "./_home/Hero";
import { Featured } from "./_home/Featured";
import { SellQuick } from "./_home/SellQuick";

export default function HomePage() {
  return (
    <div className="mn-page">
      <MainArt />
      <Hero />
      <Featured />
      <SellQuick />
    </div>
  );
}
