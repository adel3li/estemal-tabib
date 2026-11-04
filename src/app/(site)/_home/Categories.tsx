"use client";

// Picture tiles for each device type (client request, Nov 2026 — like the
// category icons in big shopping apps), in the v2 card style, at the
// top of the home page (§76). Art: the /devices symbols (BrowseArt) and
// #mn-tools from the home art for «جهاز تاني».
import Link from "next/link";
import { useState } from "react";
import { artKey } from "@/lib/demo/labels";
import { useDeviceTypes } from "@/lib/categories";
import { isListed, useDemo } from "@/lib/demo/store";
import type { BuiltinType } from "@/lib/demo/types";
import { routes } from "@/lib/routes";

const ART: Record<BuiltinType, string> = {
  unit: "#br-unit", xray: "#br-xray", autoclave: "#br-autoclave", surg: "#br-surg", endo: "#br-rotary",
  apex: "#br-apex", cure: "#br-cure", rotary: "#br-rotary", contra: "#br-contra", micro: "#br-micro",
  iocam: "#br-iocam", cam: "#br-iocam", loupe: "#br-loupe", other: "#mn-tools",
};

const countText = (n: number) => (n === 0 ? "" : n === 1 ? "جهاز واحد" : n === 2 ? "جهازين" : `${n} أجهزة`);

export function Categories() {
  const { state } = useDemo();
  const types = useDeviceTypes();
  const listed = state.devices.filter(isListed);
  // Two rows of tiles, then «اعرض كل الأقسام» (Adel, Nov 2026). Rows are 7 tiles
  // wide from 1200px and 5 below; phones/tablets swipe two rows instead.
  const [all, setAll] = useState(false);

  return (
    <section className="hm-wrap hm-cats-wrap" aria-labelledby="hm-cats-h">
      <div className="hm-cats-head">
        <h2 id="hm-cats-h" className="hm-cats-h">بتدوّر على إيه؟</h2>
        <Link href={routes.devices} className="hm-tlink">كل الأجهزة <span aria-hidden="true">←</span></Link>
      </div>
      <ul id="hm-cats-list" className={all ? "hm-cats" : "hm-cats hm-cats-2rows"}>
        {types.map((t) => (
          <li key={t.id}>
            <Link href={`${routes.devices}?cat=${t.id}`} className="hm-cat">
              <span className="hm-cat-pic">
                <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                  <use href={ART[artKey(t.id)]} />
                </svg>
              </span>
              <span className="hm-cat-name">{t.label}</span>
              <small>{countText(listed.filter((d) => d.type === t.id).length)}</small>
            </Link>
          </li>
        ))}
      </ul>
      {types.length > 10 ? (
        <div className={types.length > 14 ? "hm-cats-more" : "hm-cats-more hm-cats-more-mid"}>
          <button type="button" className="hm-btn hm-btn-line" aria-expanded={all} aria-controls="hm-cats-list" onClick={() => setAll((v) => !v)}>
            {all ? "اعرض أقل" : `اعرض كل الأقسام (${types.length})`}
          </button>
        </div>
      ) : null}
    </section>
  );
}
