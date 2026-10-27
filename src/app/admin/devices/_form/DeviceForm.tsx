"use client";

// «إضافة جهاز / تعديل» — ported from design-reference/Admin.dc.html.
import Link from "next/link";
import { useState } from "react";
import { BUSINESS } from "@/config/business";
import { isPublic, useDemo } from "@/lib/demo/store";
import { parseNum } from "@/lib/demo/labels";
import type { Device, DeviceStatus } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { FormArtDefs } from "../art";
import { Toast } from "../_ui/Toast";
import { DetailsSection } from "./DetailsSection";
import { InspectionSection } from "./InspectionSection";
import { MediaSection, NotesSection, PriceSection } from "./MediaPriceNotes";
import { PreviewAside, type Check } from "./PreviewAside";
import { SourceSection } from "./SourceSection";
import { applySubmission, deviceFields, emptyForm, formFromDevice, type FormState } from "./model";
import "../styles.css";
import "./form.css";

type Done = { id: string; status: DeviceStatus };

export function DeviceForm({ device }: { device?: Device }) {
  const { state, addDevice, updateDevice, updateSubmission } = useDemo();
  const editing = !!device;
  const [f, setF] = useState<FormState>(() => (device ? formFromDevice(device) : emptyForm()));
  const [photos, setPhotos] = useState(0);
  const [video, setVideo] = useState("");
  const [reportName, setReportName] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const [toast, setToast] = useState("");
  const set = (patch: Partial<FormState>) => setF((x) => ({ ...x, ...patch }));

  const subs = state.submissions.filter((s) => s.status !== "rejected");
  const linkedSub = f.submissionId ? state.submissions.find((s) => s.id === f.submissionId) : undefined;
  // Photos already uploaded: a seeded/existing device has them; a seller's request carries its own.
  const existingPhotos = linkedSub ? linkedSub.photos >= BUSINESS.photos.min : editing;
  const photoCount = photos + (existingPhotos ? Math.max(BUSINESS.photos.min, linkedSub?.photos ?? 0) : linkedSub?.photos ?? 0);
  const hasReport = !!reportName || !!device?.report;

  const checks: Check[] = [
    { label: "اسم الجهاز", ok: f.title.trim().length > 0 },
    { label: "السعر", ok: parseNum(f.price) > 0 },
    { label: `صور الجهاز (${BUSINESS.photos.min} على الأقل)`, ok: photoCount >= BUSINESS.photos.min },
    f.insp === "inspected" ? { label: "تقرير الفحص", ok: hasReport } : { label: "حالة الفحص", ok: true },
  ];
  const ready = checks.every((c) => c.ok);
  const locked = device && (device.status === "reserved" || device.status === "sold");
  const otherDevice = !editing && linkedSub?.deviceId ? linkedSub.deviceId : "";

  const save = (status: DeviceStatus) => {
    const fields = deviceFields(f, device);
    let id: string;
    if (device) {
      id = device.id;
      updateDevice(id, { ...fields, status });
    } else {
      id = addDevice({ ...fields, status, featured: false });
    }
    if (linkedSub && !linkedSub.deviceId) {
      updateSubmission(linkedSub.id, { status: "accepted", deviceId: id }, { text: `اتربط بإعلان ${id}`, tone: "ok" });
    }
    if (editing) {
      setToast(
        status === "published"
          ? `اتحفظ «${fields.title}» واتنشر — ظاهر دلوقتي في «كل الأجهزة».`
          : status === "draft"
            ? `اتحفظ «${fields.title || id}» كمسودة.`
            : `اتحفظت التعديلات على «${fields.title}».`,
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setDone({ id, status });
      window.scrollTo({ top: 0 });
    }
  };

  if (done) {
    const pub = done.status === "published";
    return (
      <div style={{ maxWidth: 560, margin: "80px auto", padding: 40, borderRadius: 26, background: "#FFFFFF", border: "1px solid #DCE3DF", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span style={{ width: 72, height: 72, borderRadius: 999, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l4 4 10-10" />
          </svg>
        </span>
        <h1 role="status" style={{ margin: 0, fontSize: 26 }}>
          {pub ? "الجهاز اتنشر" : "اتحفظ كمسودة"}
        </h1>
        <p style={{ margin: 0, color: "#4A5A56" }}>
          {pub ? "ظاهر دلوقتي في «كل الأجهزة» للمشترين." : "تقدر تكمّله وتنشره من «الأجهزة المعروضة»."} ({done.id})
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 8 }}>
          {pub ? (
            <Link href={routes.devices} className="ad-btn ad-pri" style={{ color: "#FFFFFF" }}>
              شوفه في كل الأجهزة
            </Link>
          ) : (
            <Link href={routes.admin.devices} className="ad-btn ad-pri" style={{ color: "#FFFFFF" }}>
              ارجع للأجهزة المعروضة
            </Link>
          )}
          <Link href={routes.admin.editDevice(done.id)} className="ad-btn ad-sec">
            كمّل تعديله
          </Link>
          <button
            type="button"
            className="ad-btn ad-sec"
            onClick={() => {
              setDone(null);
              setF(emptyForm());
              setPhotos(0);
              setVideo("");
              setReportName("");
            }}
          >
            أضف جهاز تاني
          </button>
        </div>
      </div>
    );
  }

  const title = editing ? `تعديل جهاز ${device.id}` : f.src === "seller" ? "إضافة جهاز بالنيابة عن بايع" : "إضافة جهاز من الشركة";

  return (
    <div>
      <FormArtDefs />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 14, color: "#4A5A56" }}>
            <Link href={routes.admin.root} style={{ color: "inherit" }}>
              لوحة التحكم
            </Link>{" "}
            ›{" "}
            <Link href={routes.admin.devices} style={{ color: "inherit" }}>
              الأجهزة
            </Link>{" "}
            › {editing ? "تعديل" : "إضافة جهاز"}
          </div>
          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.3 }}>{title}</h1>
          <div style={{ color: "#4A5A56" }}>
            {editing && device && isPublic(device) ? (
              <>
                الجهاز ظاهر للمشترين ·{" "}
                <Link href={routes.device(device.id)} target="_blank" style={{ fontWeight: 600 }}>
                  شوف صفحته على الموقع
                </Link>
              </>
            ) : (
              "الجهاز هيظهر في «كل الأجهزة» أول ما تنشره."
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {locked ? (
            <button type="button" className="ad-btn ad-pri" onClick={() => save(device.status)}>
              احفظ التعديلات
            </button>
          ) : (
            <>
              <button type="button" className="ad-btn ad-sec" onClick={() => save("draft")}>
                احفظ مسودة
              </button>
              <button
                type="button"
                className="ad-btn ad-pri"
                onClick={() => save("published")}
                disabled={!ready}
                aria-disabled={!ready}
                title={ready ? undefined : "كمّل «قبل النشر» الأول"}
                style={ready ? undefined : { opacity: 0.5, cursor: "not-allowed" }}
              >
                انشر الجهاز
              </button>
            </>
          )}
        </div>
      </div>

      {toast ? (
        <div style={{ marginBottom: 18 }}>
          <Toast onClose={() => setToast("")}>
            {toast}{" "}
            <Link href={routes.admin.devices} style={{ color: "inherit", textDecoration: "underline" }}>
              ارجع للأجهزة المعروضة
            </Link>
          </Toast>
        </div>
      ) : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          <SourceSection
            f={f}
            set={set}
            submissions={subs}
            onPickSubmission={(id) => {
              const s = state.submissions.find((x) => x.id === id);
              setF((x) => (s ? applySubmission(x, s) : { ...x, submissionId: "" }));
            }}
          />
          {otherDevice ? (
            <div style={{ padding: "12px 16px", borderRadius: 14, background: "#FBEEDC", border: "1px solid #F0C88A", color: "#6B3A10", fontSize: 14 }}>
              طلب {linkedSub?.id} اتحول قبل كده لإعلان {otherDevice}.{" "}
              <Link href={routes.admin.editDevice(otherDevice)} style={{ color: "inherit", fontWeight: 700, textDecoration: "underline" }}>
                عدّل الإعلان ده بدل ما تعمل واحد جديد
              </Link>
            </div>
          ) : null}
          <DetailsSection f={f} set={set} />
          <InspectionSection f={f} set={set} reportName={reportName} hasExistingReport={!!device?.report} onReport={setReportName} />
          <MediaSection photos={photos} video={video} existingPhotos={existingPhotos} onPhotos={setPhotos} onVideo={setVideo} />
          <PriceSection f={f} set={set} />
          <NotesSection f={f} set={set} />
        </div>
        <PreviewAside f={f} checks={checks} />
      </div>
    </div>
  );
}
