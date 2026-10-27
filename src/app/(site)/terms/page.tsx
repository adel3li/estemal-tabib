// `/terms` — ported from design-reference/Terms.dc.html. `?tab=buyer` opens the buyer tab.
import type { Metadata } from "next";
import "./styles.css";
import { TermsArt } from "./art";
import { TermsView } from "./TermsView";

export const metadata: Metadata = { title: "شروط البيع والشراء" };

export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;
  const initial = tab === "buyer" ? "buy" : "sell";
  return (
    <div className="tm-page" style={{ lineHeight: 1.8 }}>
      <TermsArt />
      <TermsView key={initial} initialTab={initial} />
    </div>
  );
}
