"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { loginHref } from "@/lib/auth/next";
import { useOrders } from "@/lib/orders/orders";
import { isPublic, useDemo } from "@/lib/demo/store";
import { routes } from "@/lib/routes";
import { OtSprite } from "./art";
import { TrackerHeader } from "./Header";
import { SideCards } from "./SideCards";
import { Timeline } from "./Timeline";
import "./styles.css";

export default function OrderTrackerPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder, buyerDecision, ready } = useOrders();
  const { ready: authReady, userId } = useAuth();
  const { getDevice } = useDemo();
  const [note, setNote] = useState("");
  const o = getOrder(id ?? "");

  if (!authReady || (userId && !ready)) {
    return (
      <section role="status" style={{ maxWidth: 640, margin: "0 auto", padding: "72px 20px", textAlign: "center", color: "#4A5A56" }}>
        بنحمّل طلبك…
      </section>
    );
  }

  if (!userId) {
    return (
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "72px 20px", textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>سجّل دخول عشان تتابع طلبك</h1>
        <p style={{ margin: 0, color: "#4A5A56" }}>ادخل بنفس الحساب اللي ربطنا بيه الطلب. لو مش لاقيه، كلمنا على واتساب.</p>
        <Link href={loginHref(`/orders/${encodeURIComponent(id ?? "")}`)} className="ot-cta" style={{ minHeight: 46, padding: "0 20px", borderRadius: 12, background: "#0D5C55", color: "#FFFFFF", fontWeight: 700, display: "flex", alignItems: "center" }}>
          سجّل دخول
        </Link>
      </section>
    );
  }

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
    : [];

  const decide = async (accept: boolean) => {
    try {
      await buyerDecision(o.id, accept);
      setNote(accept ? "تمام! أكّدت التقرير، وهنبدأ نجهّز الشحن لحد بابك." : "الطلب اتلغى. فلوسك هترجعلك كاملة بنفس طريقة الدفع.");
    } catch (e) {
      console.error(e);
      setNote("ما قدرناش نسجّل ردك دلوقتي. جرّب تاني أو كلمنا على واتساب.");
    }
  };
  const confirm = () => void decide(true);
  const cancel = () => void decide(false);

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
