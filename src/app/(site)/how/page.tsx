// `/how` — إزاي بنشتغل; this section used to sit on the home page.
import type { Metadata } from "next";
import "../_home/styles.css";
import { MainArt } from "../_home/art";
import { HowItWorks } from "../_home/HowItWorks";

export const metadata: Metadata = { title: "إزاي بنشتغل" };

export default function Page() {
  return (
    <div className="mn-page">
      <MainArt />
      <HowItWorks />
    </div>
  );
}
