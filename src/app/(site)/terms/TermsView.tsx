"use client";

import { useState } from "react";
import { TermsHead, type TermsTab } from "./TermsHead";
import { SellerTerms } from "./SellerTerms";
import { BuyerTerms } from "./BuyerTerms";

/** Seller/buyer tabs (Terms.dc.html script). The server page passes the
 *  `?tab=` value and keys this component on it, so a link to
 *  `/terms?tab=buyer` from inside the page also switches the tab. */
export function TermsView({ initialTab }: { initialTab: TermsTab }) {
  const [tab, setTab] = useState<TermsTab>(initialTab);
  return (
    <>
      <TermsHead tab={tab} onTab={setTab} />
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "26px 20px 72px" }}>
        {tab === "sell" ? <SellerTerms /> : <BuyerTerms />}
      </section>
    </>
  );
}
