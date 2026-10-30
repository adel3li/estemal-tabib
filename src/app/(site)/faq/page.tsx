// `/faq` — أسئلة شائعة; this section used to sit on the home page.
import type { Metadata } from "next";
import "../_home/styles.css";
import { MainArt } from "../_home/art";
import { Faq } from "../_home/Faq";

export const metadata: Metadata = { title: "أسئلة شائعة" };

export default function Page() {
  return (
    <div className="mn-page">
      <MainArt />
      <Faq />
    </div>
  );
}
