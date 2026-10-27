"use client";

// Ported from design-reference/Admin-Submissions.dc.html
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { BUSINESS } from "@/config/business";
import { useDemo } from "@/lib/demo/store";
import type { Submission, SubmissionStatus } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { Toast, type ToastTone } from "../devices/_ui/Toast";
import { SubmissionArtDefs } from "./art";
import { FeePanel } from "./_parts/FeePanel";
import { FEE, matches } from "./_parts/meta";
import { SubmissionActions } from "./_parts/SubmissionActions";
import { SubmissionInfo } from "./_parts/SubmissionInfo";
import { SubmissionList } from "./_parts/SubmissionList";
import "./styles.css";

export default function AdminSubmissionsPage() {
  const { state, updateSubmission, acceptSubmission, addInspection } = useDemo();
  const [tab, setTab] = useState<SubmissionStatus>("new");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>("#1024");
  const [toast, setToast] = useState<{ body: ReactNode; tone: ToastTone } | null>(null);
  const [feeOpen, setFeeOpen] = useState(false);
  const detailRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLElement>(null);
  // < 1024px the detail sits below the list: bring it (or the list) into view on tap.
  const stacked = () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
  const reveal = (el: HTMLElement | null) => {
    if (!el || !stacked()) return;
    requestAnimationFrame(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  const subs = state.submissions;
  const needle = q.trim().toLowerCase();
  const counts: Record<SubmissionStatus, number> = { new: 0, follow_up: 0, accepted: 0, rejected: 0 };
  subs.forEach((x) => {
    if (matches(x, needle)) counts[x.status]++;
  });
  const items = subs.filter((x) => x.status === tab && matches(x, needle));
  const p = sel ? subs.find((x) => x.id === sel) : undefined;

  const pickTab = (t: SubmissionStatus) => {
    const first = subs.find((x) => x.status === t && matches(x, needle));
    setTab(t);
    if (first) setSel(first.id);
    setFeeOpen(false);
  };
  const ok = (body: ReactNode) => setToast({ body, tone: "ok" });

  const handlers = (s: Submission) => ({
    accept: () => {
      const deviceId = acceptSubmission(s.id);
      setTab("accepted");
      ok(
        <>
          طلب {s.id} اتقبل واتحول لإعلان مسودة ({deviceId}) — اتنقل لتاب «اتقبل».{" "}
          <Link href={routes.admin.editDevice(deviceId)} style={{ color: "inherit", textDecoration: "underline" }}>
            كمّل الإعلان
          </Link>
        </>,
      );
    },
    requestPhotos: (what: string) => {
      updateSubmission(s.id, { status: "follow_up" }, { text: `اتطلب من البايع: ${what}`, tone: "warn" });
      ok(`اتبعت للبايع طلب ${what} — الطلب بقى «محتاج متابعة».`);
    },
    schedule: (date: string, slot: string, tech: string) => {
      // Demo week is 24–30 October (day 0..6); dates outside it land on the last day.
      const dayOfMonth = Number(date.slice(8, 10));
      const day = date.startsWith("2026-10-") && dayOfMonth >= 24 && dayOfMonth <= 30 ? dayOfMonth - 24 : 6;
      const inspId = addInspection({
        title: s.details,
        deviceType: s.deviceType,
        governorate: s.governorate,
        location: s.keepLocation === "send_to_platform" ? "مقر الفحص" : `عند البايع · ${s.governorate}`,
        technician: tech,
        day,
        time: slot,
        kind: "pre_publish",
        deviceId: s.deviceId,
      });
      updateSubmission(s.id, { status: "follow_up" }, { text: `ميعاد فحص ${inspId}: ${date} · ${slot} · ${tech}`, tone: "info" });
      ok(
        <>
          اتحدد ميعاد الفحص {date} ({slot}) واتبعت للبايع.{" "}
          <Link href={routes.admin.inspections} style={{ color: "inherit", textDecoration: "underline" }}>
            شوف الفحص {inspId}
          </Link>
        </>,
      );
    },
    reject: (reason: string, note: string) => {
      updateSubmission(
        s.id,
        { status: "rejected", rejectReason: reason },
        { text: `اترفض: ${reason}${note ? ` — رسالة للبايع: ${note}` : ""}`, tone: "bad" },
      );
      setToast({ body: `طلب ${s.id} اترفض واتبعت السبب للبايع.`, tone: "bad" });
    },
  });

  const reopen = (s: Submission) => {
    updateSubmission(s.id, { status: "follow_up", rejectReason: undefined }, { text: "اتفتح تاني للمتابعة", tone: "warn" });
    ok(`طلب ${s.id} رجع «محتاج متابعة».`);
  };

  const setFee = (s: Submission, feeStatus: Submission["feeStatus"], feeReference: string) => {
    const fee = BUSINESS.sellerSeriousnessFeeEGP;
    const refTxt = feeReference ? ` (رقم التحويل ${feeReference})` : "";
    const line =
      feeStatus === s.feeStatus
        ? { text: `اتسجل رقم تحويل رسوم الجدية${refTxt}`, tone: "info" as const }
        : feeStatus === "paid"
          ? { text: `رسوم الجدية ${fee} ج.م اتدفعت${refTxt}`, tone: "ok" as const }
          : feeStatus === "refunded"
            ? { text: `رسوم الجدية ${fee} ج.م اترجعت للبايع${refTxt}`, tone: "info" as const }
            : { text: `رسوم الجدية ${fee} ج.م اتخصمت حسب الشروط`, tone: "warn" as const };
    updateSubmission(s.id, { feeStatus, feeReference }, line);
    ok(`طلب ${s.id}: رسوم الجدية — ${FEE[feeStatus].txt}.`);
    setFeeOpen(false);
  };

  const open = p ? p.status === "new" || p.status === "follow_up" : false;

  return (
    <>
      <SubmissionArtDefs />
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › طلبات البيع الواردة</div>
        <h1 className="sb-h1" style={{ margin: 0, lineHeight: 1.3 }}>طلبات البيع الواردة</h1>
        <div style={{ color: "#4A5A56" }}>
          طلبات الدكاترة اللي عايزين يبيعوا أجهزتهم. راجع الطلب، وبعدين اقبله وحوّله لإعلان، أو اطلب صور، أو حدد ميعاد فحص مع فني معتمد.
        </div>
      </div>

      {toast ? (
        <Toast tone={toast.tone} onClose={() => setToast(null)} closeClass="sb-act" floating>
          {toast.body}
        </Toast>
      ) : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <SubmissionList
          ref={listRef}
          tab={tab}
          counts={counts}
          onTab={pickTab}
          q={q}
          onQ={setQ}
          items={items}
          sel={sel}
          onPick={(id) => {
            setSel(id);
            setFeeOpen(false);
            reveal(detailRef.current);
          }}
        />

        {p ? (
          <section ref={detailRef} className="ad-card sb-detail" aria-labelledby="sb-dt" style={{ minWidth: 0, gap: 18 }}>
            <button type="button" className="sb-act sb-back" onClick={() => reveal(listRef.current)}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
              رجوع للقائمة
            </button>
            <SubmissionInfo p={p} onReopen={() => reopen(p)} />

            <div>
              <button
                type="button"
                className="ad-hint sb-feebtn"
                aria-expanded={feeOpen}
                onClick={() => setFeeOpen((v) => !v)}
                style={{ border: 0, background: "none", padding: 0, cursor: "pointer", textDecoration: "underline", fontWeight: 600, color: "#0D5C55" }}
              >
                {feeOpen ? "اقفل إدارة رسوم الجدية" : "إدارة رسوم الجدية (اتدفعت / اترجعت + رقم التحويل)"}
              </button>
              {feeOpen ? (
                <div style={{ marginTop: 10 }}>
                  <FeePanel key={p.id} p={p} onSet={(st, ref) => setFee(p, st, ref)} />
                </div>
              ) : null}
            </div>

            {open ? <SubmissionActions key={p.id} p={p} h={handlers(p)} /> : null}
          </section>
        ) : (
          <section className="ad-card sb-detail" style={{ minWidth: 0, alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 360, color: "#4A5A56" }}>
            <svg aria-hidden="true" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9FB2AB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16v12H4z" />
              <path d="M4 7l8 6 8-6" />
            </svg>
            <div style={{ fontWeight: 700, color: "#12221F" }}>اختار طلب من القايمة</div>
            <div>تفاصيل الطلب والصور والإجراءات هتظهر هنا.</div>
          </section>
        )}
      </div>
    </>
  );
}
