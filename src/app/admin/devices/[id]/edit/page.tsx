"use client";

// Ported from design-reference/Admin.dc.html (edit mode)
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { routes } from "@/lib/routes";
import { DeviceForm } from "../../_form/DeviceForm";

export default function EditDevicePage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params?.id ?? "");
  const { ready, getDevice } = useDemo();
  const device = getDevice(id);

  // Devices created in this browser only exist after localStorage is read.
  if (!device && !ready) return <div style={{ padding: 40, color: "#4A5A56" }}>بنحمّل الجهاز…</div>;

  if (!device) {
    return (
      <div style={{ maxWidth: 560, margin: "80px auto", padding: 40, borderRadius: 26, background: "#FFFFFF", border: "1px solid #DCE3DF", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>مش لاقيين الجهاز ده</h1>
        <p style={{ margin: 0, color: "#4A5A56" }}>مفيش جهاز برقم «{id}». يمكن اتمسح أو الرابط فيه غلطة.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          <Link href={routes.admin.devices} className="ad-btn ad-pri" style={{ color: "#FFFFFF" }}>
            ارجع للأجهزة المعروضة
          </Link>
          <Link href={routes.admin.newDevice} className="ad-btn ad-sec">
            أضف جهاز جديد
          </Link>
        </div>
      </div>
    );
  }

  // key: re-initialise the form when the stored device first appears after hydration.
  return <DeviceForm key={`${device.id}-${ready ? 1 : 0}`} device={device} />;
}
