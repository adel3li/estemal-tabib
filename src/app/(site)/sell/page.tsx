import type { Metadata } from "next";
import { Suspense } from "react";
import { SellArt } from "./art";
import { SellForm } from "./SellForm";
import "./styles.css";

export const metadata: Metadata = { title: "اعرض جهازك للبيع" };

export default function SellPage() {
  return (
    <div className="sl-root">
      <SellArt />
      <Suspense fallback={null}>
        <SellForm />
      </Suspense>
    </div>
  );
}
