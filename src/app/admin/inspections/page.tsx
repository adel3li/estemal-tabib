"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { isPublic, useDemo } from "@/lib/demo/store";
import { typeLabel } from "@/lib/demo/labels";
import { STEP_REPORT, nowLabel, useOrders } from "@/lib/demo/orders";
import type { Inspection } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { InSprite } from "./art";
import { Kpis } from "./Kpis";
import { ReportPanel } from "./ReportPanel";
import { WeekList } from "./WeekList";
import { TK, inTab, isBuyer, missing, type Form, type Tab, type Toast } from "./model";
import "./styles.css";

function without<T>(rec: Record<string, T>, key: string): Record<string, T> {
  const next = { ...rec };
  delete next[key];
  return next;
}

export default function InspectionsPage() {
  const { state, updateInspection, approveInspection, getDevice } = useDemo();
  const { ensureStep } = useOrders();
  const items = state.inspections;

  const [sel, setSel] = useState<string | null>("F-297");
  const [tab, setTab] = useState<Tab>("all");
  const [day, setDay] = useState(-1);
  const [q, setQ] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [err, setErr] = useState("");
  // Unsaved report edits per inspection (saved to the store on «احفظ» / «اعتمد»).
  const [drafts, setDrafts] = useState<Record<string, Form>>({});
  // Picked photo/video files stay in memory only (demo — no upload).
  const files = useRef<Record<string, File[]>>({});
  const asideRef = useRef<HTMLElement>(null);

  // On phones/tablets the report panel sits under the list: bring it into view.
  const narrow = () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
  const scrollToEl = (el: Element | null) => {
    if (!el || !narrow()) return;
    requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const openReport = (id: string) => {
    setSel(id);
    setErr("");
    scrollToEl(asideRef.current);
  };
  const backToList = () => {
    scrollToEl(document.getElementById(`in-row-${sel}`) ?? document.getElementById("in-list-h"));
  };

  const query = q.trim();
  const matchQ = (it: Inspection) =>
    !query || `${it.title} #${it.id} ${it.governorate} ${typeLabel(it.deviceType)} ${it.location}`.includes(query);
  const base = items.filter(matchQ);
  const rows = base.filter((it) => inTab(it, tab) && (day < 0 || it.day === day)).sort((a, b) => a.day - b.day);

  const selIt = items.find((it) => it.id === sel) ?? null;
  const form = selIt ? drafts[selIt.id] ?? selIt.form : null;

  const editForm = (fn: (f: Form) => Form) => {
    if (!selIt || !form) return;
    setDrafts((d) => ({ ...d, [selIt.id]: fn(form) }));
    setErr("");
  };

  const assign = (it: Inspection, tech: string) => {
    updateInspection(it.id, { technician: tech });
    setToast({ kind: "ok", txt: tech ? `اتحدد ${tech} لفحص ${it.title}.` : `اتشال الفني من فحص ${it.title}.` });
  };

  const save = () => {
    if (!selIt || !form) return;
    updateInspection(selIt.id, { form, status: "needs_review" });
    setDrafts((d) => without(d, selIt.id));
    setErr("");
    setToast({ kind: "info", txt: `تقرير ${selIt.title} اتحفظ، وحالته بقت «محتاج مراجعة».` });
  };

  const approve = () => {
    if (!selIt || !form) return;
    const m = missing(selIt, form);
    if (m.length) {
      setErr(m.join("، "));
      return;
    }
    updateInspection(selIt.id, { form });
    const deviceId = approveInspection(selIt.id);
    setDrafts((d) => without(d, selIt.id));
    setErr("");
    if (isBuyer(selIt) && selIt.orderId) {
      ensureStep(selIt.orderId, STEP_REPORT, {
        when: nowLabel(),
        txt: "تقرير الفحص اتبعت للمشتري · مستنيين تأكيده",
        who: "[اسم الموظف]",
        col: "#F2A33A",
      });
    }
    setToast({
      kind: "ok",
      deviceId,
      txt: isBuyer(selIt)
        ? `التقرير اتعمد واتبعت للمشتري، وطلب ${selIt.orderId ?? ""} اتحرك لخطوة «تقرير الفحص».`
        : `${selIt.title} اتنشر في «كل الأجهزة» بعلامة «تم الفحص».`,
    });
  };

  const reopen = () => {
    if (!selIt) return;
    updateInspection(selIt.id, { status: "needs_review" });
    setToast({ kind: "info", txt: "التقرير اتفتح للتعديل، ورجع «محتاج مراجعة»." });
  };

  const tk = TK[toast?.kind ?? "ok"];
  const toastDevice = toast?.deviceId ? getDevice(toast.deviceId) : undefined;

  return (
    <>
      <InSprite />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الفحوصات</div>
          <h1 className="in-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>الفحوصات</h1>
          <div style={{ color: "#4A5A56" }}>مواعيد الفني المعتمد وتقارير الفحص، قبل النشر أو بعد طلب مشتري.</div>
        </div>
        <label className="in-search">
          <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>دوّر في الفحوصات</span>
          <input type="search" className="ad-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="دوّر بالجهاز، المحافظة أو رقم الفحص" />
        </label>
      </div>

      {toast ? (
        <div role="status" className="in-toast" style={{ padding: "14px 18px", borderRadius: 16, background: tk[0], border: `1px solid ${tk[1]}`, color: tk[2], display: "flex", alignItems: "center", gap: 12, fontWeight: 600, flexWrap: "wrap" }}>
          <span style={{ width: 28, height: 28, borderRadius: 999, background: tk[2], color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontSize: 14 }}>{tk[3]}</span>
          <span style={{ flex: 1 }}>{toast.txt}</span>
          {toastDevice ? (
            <Link
              href={isPublic(toastDevice) ? routes.device(toastDevice.id) : routes.admin.editDevice(toastDevice.id)}
              style={{ fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              {isPublic(toastDevice) ? `شوف صفحة الجهاز (${toastDevice.id}) ←` : `كمّل بيانات الجهاز (${toastDevice.id}) ←`}
            </Link>
          ) : null}
          <button type="button" className="in-mini" onClick={() => setToast(null)} style={{ border: `1px solid ${tk[1]}`, background: "#FFFFFF", color: "#12221F" }}>تمام</button>
        </div>
      ) : null}

      <Kpis items={items} tab={tab} onPick={(t) => { setTab(t); setDay(-1); }} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
        <WeekList
          items={items}
          base={base}
          rows={rows}
          tab={tab}
          day={day}
          sel={sel}
          onTab={setTab}
          onDay={setDay}
          onOpen={openReport}
          onAssign={assign}
        />

        <aside ref={asideRef} className="in-aside">
          {selIt && form ? (
            <ReportPanel
              it={selIt}
              form={form}
              err={err}
              onForm={editForm}
              onPhotos={(picked) => {
                files.current[selIt.id] = [...(files.current[selIt.id] ?? []), ...picked];
                editForm((f) => ({ ...f, photos: f.photos + picked.length }));
              }}
              onClose={() => { setSel(null); setErr(""); }}
              onBack={backToList}
              onSave={save}
              onApprove={approve}
              onReopen={reopen}
            />
          ) : (
            <div className="ad-card" style={{ alignItems: "center", textAlign: "center", padding: "40px 24px" }}>
              <span style={{ width: 60, height: 60, borderRadius: 18, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13l2 2 4-4" /></svg>
              </span>
              <div style={{ fontWeight: 700 }}>اختار فحص من الجدول</div>
              <div className="ad-hint">هتلاقي هنا نموذج تقرير الفحص تملاه وتعتمده.</div>
            </div>
          )}

          <div style={{ padding: "14px 16px", borderRadius: 16, background: "#FFFFFF", border: "1px solid #DCE3DF", fontSize: 13, color: "#3C4C48", display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontWeight: 700, color: "#12221F" }}>تذكير</span>
            <span>الفحص بيعمله فني معتمد بس. الجهاز بيتعرض بحالة «تم الفحص» أو «يُفحص عند الطلب».</span>
            <span>سبب البيع داخلي، ميتكتبش في التقرير.</span>
          </div>
        </aside>
      </div>
    </>
  );
}
