import type { Metadata } from "next";
import { Suspense } from "react";
import "./styles.css";
import { BrowseClient } from "./BrowseClient";

export const metadata: Metadata = { title: "كل الأجهزة" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BrowseClient />
    </Suspense>
  );
}
