"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { STEP_SHIPPING, nowLabel, useOrders } from "@/lib/demo/orders";
import { isPublic, useDemo } from "@/lib/demo/store";
import { routes } from "@/lib/routes";
import { OtSprite } from "./art";
import { TrackerHeader } from "./Header";
import { SideCards } from "./SideCards";
import { Timeline } from "./Timeline";
import "./styles.css";

export default function OrderTrackerPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder, ensureStep, cancelOrder } = useOrders();
  const { getDevice } = useDemo();
  const [note, setNote] = useState("");
  const o = getOrder(id ?? "");

  if (!o) {
    return (
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "72px 20px", textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>مش لاقيين الطلب ده</h1>
        <p style={{ margin: 0, color: "#4A5A56" }}>اتأكد من رقم الطلب في الرسالة اللي وصلتك، أو كلمنا على واتساب.</p>
        <Link href={routes.home} className="ot-cta" style={{ minHeight: 46, padding: "0 20px", borderRadius: 12, background: "#0D5C55", color: "#FFFFFF", fontWeight: 700, display: "flex", alignItems: "center" }}>
          ارجع للرئيسية
        </Link>
      </section>
    );
  }

  const device = o.deviceId ? getDevice(o.deviceId) : undefined;
  const reportHref = device && isPublic(device) ? `${routes.device(device.id)}#report` : undefined;
  const report = device?.report;
  const badges = report
    ? [
        { txt: `كفاءة التشغيل: ${report.efficiency}`, ok: true },
        ...(report.defects.length ? [{ txt: report.defects.length === 1 ? "ملاحظة واحدة" : `${report.defects.length} ملاحظات`, ok: false }] : []),
      ]
    : [
        // Demo order #2043 has no linked listing: show the design's report summary.
        { txt: "كفاءة التشغيل: ممتاز", ok: true },
        { txt: "Bowie-Dick: ناجح", ok: true },
        { txt: "ملاحظة واحدة", ok: false },
      ];

  const confirm = () => {
    ensureStep(o.id, STEP_SHIPPING, { when: nowLabel(), txt: "المشتري أكّد تقرير الفحص · الطلب اتحرك لخطوة «الشحن»", who: "المشتري", col: "#0D5C55" });
    setNote("تمام! أكّدت التقرير، وهنبدأ نجهّز الشحن لحد بابك.");
  };
  const cancel = () => {
    cancelOrder(o.id, { when: nowLabel(), txt: "المشتري رفض تقرير الفحص · الطلب اتلغى والفلوس هترجع كاملة", who: "المشتري", col: "#B3261E" });
    setNote("الطلب اتلغى. فلوسك هترجعلك كاملة بنفس طريقة الدفع.");
  };

  return (
    <section className="ot-wrap">
      <OtSprite />
      <TrackerHeader o={o} />
      {note ? (
        <div role="status" style={{ padding: "12px 16px", borderRadius: 14, background: o.status === "active" ? "#EAF5DD" : "#FBE9E7", color: o.status === "active" ? "#2F5E16" : "#7A1A14", fontWeight: 600 }}>
          {note}
        </div>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
        <Timeline o={o} reportHref={reportHref} badges={badges} onConfirm={confirm} onCancel={cancel} />
        <SideCards o={o} />
      </div>
    </section>
  );
}
