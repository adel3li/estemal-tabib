// `/warranty` — الضمان; this section used to sit on the home page.
import type { Metadata } from "next";
import "../_home/styles.css";
import { MainArt } from "../_home/art";
import { Warranty } from "../_home/Warranty";

export const metadata: Metadata = { title: "الضمان" };

export default function Page() {
  return (
    <div className="mn-page">
      <MainArt />
      <Warranty />
    </div>
  );
}
