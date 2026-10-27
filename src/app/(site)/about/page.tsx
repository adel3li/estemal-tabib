// `/about` — ported from design-reference/About.dc.html.
import type { Metadata } from "next";
import "./styles.css";
import { AboutArt } from "./art";
import { AboutBody } from "./AboutBody";

export const metadata: Metadata = { title: "مين إحنا" };

export default function AboutPage() {
  return (
    <div className="ab-page" style={{ lineHeight: 1.8 }}>
      <AboutArt />
      <AboutBody />
    </div>
  );
}
