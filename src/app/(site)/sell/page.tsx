import type { Metadata } from "next";
import { Suspense } from "react";
import { SellArt } from "./art";
import { SellForm } from "./SellForm";
import "../_home/v2.css";
import "./styles.css";

export const metadata: Metadata = { title: "اعرض جهازك للبيع" };

export default function SellPage() {
  return (
    <div className="sl-root hm-page">
      <SellArt />
      <Suspense fallback={null}>
        <SellForm />
      </Suspense>
    </div>
  );
}
