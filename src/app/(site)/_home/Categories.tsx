// Picture tiles for each device type at the top of the home page, so visitors
// jump straight to what they're looking for (client request, Nov 2026 — like
// the category icons in big shopping apps). Art: the /devices symbols (BrowseArt)
// and #mn-tools from the home art for «جهاز تاني».
"use client";

import Link from "next/link";
import { artKey } from "@/lib/demo/labels";
import { useDeviceTypes } from "@/lib/categories";
import type { BuiltinType } from "@/lib/demo/types";
import { routes } from "@/lib/routes";

const ART: Record<BuiltinType, string> = {
  unit: "#br-unit", xray: "#br-xray", autoclave: "#br-autoclave", surg: "#br-surg", endo: "#br-rotary",
  apex: "#br-apex", cure: "#br-cure", rotary: "#br-rotary", contra: "#br-contra", micro: "#br-micro",
  iocam: "#br-iocam", cam: "#br-iocam", loupe: "#br-loupe", other: "#mn-tools",
};

export function Categories() {
  const types = useDeviceTypes();
  return (
    <section className="mn-cats-wrap" aria-labelledby="mn-cats-h">
      <div className="mn-cats-head">
        <h2 id="mn-cats-h" className="mn-cats-h">
          بتدوّر على إيه؟
        </h2>
        <Link href={routes.devices} className="mn-cats-all">
          كل الأجهزة ←
        </Link>
      </div>
      <ul className="mn-cats">
        {types.map((t) => (
          <li key={t.id}>
            <Link href={`${routes.devices}?cat=${t.id}`} className="mn-cat">
              <span className="mn-cat-pic">
                <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                  <use href={ART[artKey(t.id)]} />
                </svg>
              </span>
              <span className="mn-cat-name">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
