// `/` — ported from design-reference/Main.dc.html (header/footer come from the layout).
import "./_home/styles.css";
import { MainArt } from "./_home/art";
import { Hero } from "./_home/Hero";
import { HowItWorks } from "./_home/HowItWorks";
import { Featured } from "./_home/Featured";
import { WarrantyAndCategories } from "./_home/Warranty";
import { SellQuick } from "./_home/SellQuick";
import { Faq } from "./_home/Faq";

export default function HomePage() {
  return (
    <div className="mn-page">
      <MainArt />
      <Hero />
      <HowItWorks />
      <Featured />
      <WarrantyAndCategories />
      <SellQuick />
      <Faq />
    </div>
  );
}
