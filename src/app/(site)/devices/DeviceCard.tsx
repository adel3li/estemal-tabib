// Device card on /devices — v2 flat card (design-explorations/v2/src/browse.html).
import Link from "next/link";
import type { Device, DeviceType } from "@/lib/demo/types";
import { CONDITIONS, fmt, typeLabel } from "@/lib/demo/labels";
import { routes } from "@/lib/routes";

/** Store type → Browse.dc.html symbol. Types without their own art borrow the closest one. */
const IMG: Record<DeviceType, string> = {
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

const ph = (x: string) => !x || x.startsWith("[");

export function DeviceCard({ d }: { d: Device }) {
  const inspected = d.inspection === "inspected";
  const spec = [ph(d.year) ? "" : d.year, d.governorate].filter(Boolean).join(" · ") || typeLabel(d.type);
  return (
    <Link href={routes.device(d.id)} className="hm-card br-card">
      <span className="hm-ph hm-card-ph">
        <svg role="img" aria-label={d.title} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
          <use href={IMG[d.type]} />
        </svg>
        <span className="hm-code hm-num">{d.id}</span>
        <span className="br-photo-tag">{inspected ? "صورة من فريق الفحص" : "صورة من البايع"}</span>
      </span>
      <h3 className="hm-card-title">{d.title}</h3>
      <div className="hm-spec">{spec}</div>
      <div className="hm-spec">الحالة: {CONDITIONS[d.condition].short} · صيانة {d.maintenanceMonths} شهور</div>
      <div className="hm-price">
        <span className="hm-num">{fmt(d.price)}</span> <small>ج.م</small>
      </div>
      <div className={inspected ? "hm-status hm-ok" : "hm-status hm-ord"}>
        <span className="hm-d" aria-hidden="true" />
        {inspected ? "تم الفحص" : "يُفحص عند الطلب"}
        <em>{inspected ? "فيه تقرير" : "قبل الشحن"}</em>
      </div>
    </Link>
  );
}
