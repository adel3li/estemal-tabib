// Device card on /devices — v2 flat card (design-explorations/v2/src/browse.html).
import { monthsAr } from "@/config/business";
import Link from "next/link";
import type { BuiltinType, Device } from "@/lib/demo/types";
import { artKey, CONDITIONS, fmt, typeLabel } from "@/lib/demo/labels";
import { OldPrice } from "@/components/site/Price";
import { SaveHeart } from "@/components/site/SaveButton";
import { routes } from "@/lib/routes";
import { DevicePic } from "@/components/site/DevicePic";

/** Store type → Browse.dc.html symbol. Types without their own art borrow the closest one. */
const IMG: Record<BuiltinType, string> = {
  unit: "#br-unit",
  xray: "#br-xray",
  autoclave: "#br-autoclave",
  surg: "#br-surg",
  endo: "#br-rotary",
  apex: "#br-apex",
  cure: "#br-cure",
  rotary: "#br-rotary",
  contra: "#br-contra",
  micro: "#br-micro",
  iocam: "#br-iocam",
  cam: "#br-iocam",
  loupe: "#br-loupe",
  other: "#br-unit",
};

export function DeviceCard({ d }: { d: Device }) {
  const inspected = d.inspection === "inspected";
  // No year or location on cards (client feedback).
  const spec = typeLabel(d.type);
  return (
    <div className="card-wrap">
    <SaveHeart deviceId={d.id} title={d.title} />
    <Link href={routes.device(d.id)} className="hm-card br-card">
      <span className="hm-ph hm-card-ph">
        <DevicePic src={d.photos?.[0]} art={IMG[artKey(d.type)]} label={d.title} />
        <span className="hm-code hm-num">{d.id}</span>
        <span className="br-photo-tag">{inspected ? "صورة من فريق الفحص" : "صورة من البايع"}</span>
      </span>
      <h3 className="hm-card-title">{d.title}</h3>
      <div className="hm-spec">{spec}</div>
      <div className="hm-spec">الحالة: {CONDITIONS[d.condition].short} · صيانة {monthsAr(d.maintenanceMonths)}</div>
      {(d.available ?? 1) > 1 ? <div className="hm-pill hm-pill-stock">متاح {d.available} قطع</div> : null}
      <OldPrice d={d} />
      <div className="hm-price">
        <span className="hm-num">{fmt(d.price)}</span> <small>ج.م</small>
      </div>
      <div className={inspected ? "hm-status hm-ok" : "hm-status hm-ord"}>
        <span className="hm-d" aria-hidden="true" />
        {inspected ? "تم الفحص" : "يُفحص عند الطلب"}
        <em>{inspected ? "فيه تقرير" : "قبل الشحن"}</em>
      </div>
    </Link>
    </div>
  );
}
