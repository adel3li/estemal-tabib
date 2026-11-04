// v2 page head: petrol band with an orange-dash eyebrow, the page title and a
// short lede. Used by the content pages (how, warranty, faq, reviews, about, terms).
// Styles: _home/v2.css (.hm-head).
import type { ReactNode } from "react";

export function PageHead({ eyebrow, title, lede, aside }: { eyebrow: string; title: ReactNode; lede?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="hm-head">
      <div className="hm-wrap hm-head-grid">
        <div className="hm-head-copy">
          <div className="hm-eyebrow">{eyebrow}</div>
          <h1 className="hm-head-h">{title}</h1>
          {lede ? <p className="hm-lede">{lede}</p> : null}
        </div>
        {aside ? <div className="hm-head-aside">{aside}</div> : null}
      </div>
    </section>
  );
}
