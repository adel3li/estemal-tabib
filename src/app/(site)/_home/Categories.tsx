"use client";

// Picture tiles for each device type (client request, Nov 2026 — like the
// category icons in big shopping apps), in the v2 card style: they overlap the
// bottom of the hero on desktop. Art: the /devices symbols (BrowseArt) and
// #mn-tools from the home art for «جهاز تاني».
import Link from "next/link";
import { DEVICE_TYPES } from "@/lib/demo/labels";
import { isListed, useDemo } from "@/lib/demo/store";
import type { DeviceType } from "@/lib/demo/types";
import { routes } from "@/lib/routes";

const ART: Record<DeviceType, string> = {
  unit: "#br-unit", xray: "#br-xray", autoclave: "#br-autoclave", surg: "#br-surg", endo: "#br-rotary",
  apex: "#br-apex", cure: "#br-cure", rotary: "#br-rotary", contra: "#br-contra", micro: "#br-micro",
  iocam: "#br-iocam", cam: "#br-iocam", loupe: "#br-loupe", other: "#mn-tools",
};

const countText = (n: number) => (n === 0 ? "" : n === 1 ? "جهاز واحد" : n === 2 ? "جهازين" : `${n} أجهزة`);

export function Categories() {
  const { state } = useDemo();
  const listed = state.devices.filter(isListed);

  return (
    <section className="hm-wrap hm-cats-wrap" aria-label="أقسام الأجهزة">
      <ul className="hm-cats">
        {DEVICE_TYPES.map((t) => (
          <li key={t.id}>
            <Link href={`${routes.devices}?cat=${t.id}`} className="hm-cat">
              <span className="hm-cat-pic">
                <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                  <use href={ART[t.id]} />
                </svg>
              </span>
              <span className="hm-cat-name">{t.label}</span>
              <small>{countText(listed.filter((d) => d.type === t.id).length)}</small>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
