import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestArt } from "./art";
import { RequestForm } from "./RequestForm";
import "./styles.css";

export const metadata: Metadata = { title: "اطلب جهاز" };

export default function RequestPage() {
  return (
    <div className="rq-root">
      <RequestArt />
      <Suspense fallback={null}>
        <RequestForm />
      </Suspense>
    </div>
  );
}
