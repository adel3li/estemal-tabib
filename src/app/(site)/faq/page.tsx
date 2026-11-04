// `/faq` — أسئلة شائعة; this section used to sit on the home page.
import type { Metadata } from "next";
import "../_home/styles.css";
import "../_home/v2.css";
import { MainArt } from "../_home/art";
import { Faq } from "../_home/Faq";

export const metadata: Metadata = { title: "أسئلة شائعة" };

export default function Page() {
  return (
    <div className="mn-page hm-page">
      <MainArt />
      <Faq />
    </div>
  );
}
