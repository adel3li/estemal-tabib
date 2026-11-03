"use client";

// Ported from design-reference/Admin-Submissions.dc.html
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fmt } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import type { Submission } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { scheduledIso } from "@/lib/inspections/db";
import { recordSellerFee } from "@/lib/submissions/db";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Toast, type ToastTone } from "../devices/_ui/Toast";
import { SubmissionArtDefs } from "./art";
import { ContactPanel } from "./_parts/ContactPanel";
import { FeePanel, type FeeHandlers } from "./_parts/FeePanel";
import { FEE, FEE_METHODS, HQ, inTab, matches, NO_REPLY_REASON, TABS, type Tab } from "./_parts/meta";
import { SubmissionActions } from "./_parts/SubmissionActions";
import { SubmissionInfo } from "./_parts/SubmissionInfo";
import { SubmissionList } from "./_parts/SubmissionList";
import "./styles.css";

export default function AdminSubmissionsRoute() {
  return (
    <Suspense>
      <AdminSubmissionsPage />
    </Suspense>
  );
}

function AdminSubmissionsPage() {
  const { ready, submissionsError, state, updateSubmission, acceptSubmission, addInspection, updateDevice, setSellerTrust } = useDemo();
  const { userId } = useAuth();
  // ?open=#1024 (links from the dashboard home) picks that request and its tab.
  const openId = useSearchParams().get("open");
  const [pickedTab, setTab] = useState<Tab | null>(null);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(openId);
  const [toast, setToast] = useState<{ body: ReactNode; tone: ToastTone } | null>(null);
  const [busy, setBusy] = useState(false);
  // Clock for the 24-hour review and no-reply deadlines (refreshed every minute).
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);
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
  const opened = openId ? subs.find((x) => x.id === openId) : undefined;
  const tab: Tab = pickedTab ?? (opened ? (opened.sellerTrust === "suspicious" ? "spam" : opened.status) : "new");
  const needle = q.trim().toLowerCase();
  const counts = Object.fromEntries(TABS.map(([t]) => [t, subs.filter((x) => inTab(x, t) && matches(x, needle)).length])) as Record<Tab, number>;
  const items = subs.filter((x) => inTab(x, tab) && matches(x, needle));
  // Nothing picked yet (first load) → the first request in the tab.
  const p = (sel ? subs.find((x) => x.id === sel) : undefined) ?? (sel === null ? items[0] : undefined);

  const pickTab = (t: Tab) => {
    const first = subs.find((x) => inTab(x, t) && matches(x, needle));
    setTab(t);
    setSel(first ? first.id : null);
  };
  const ok = (body: ReactNode) => setToast({ body, tone: "ok" });
  const iso = () => new Date().toISOString();
  /** The first message to the seller starts the no-reply count (ADMIN_SPEC §2). */
  const contactPatch = (s: Submission) => (s.firstContactAt ? {} : { firstContactAt: iso() });
  const tabOf = (s: Submission): Tab => (s.sellerTrust === "suspicious" ? "spam" : s.status);

  const handlers = (s: Submission) => ({
    accept: (feeAmount: number) => {
      const deviceId = acceptSubmission(s.id);
      updateSubmission(s.id, { feeAmount }, { text: `رسوم الجدية للجهاز ده: ${fmt(feeAmount)} ج.م — اطلبها من البايع`, tone: "info" });
      setTab(tabOf({ ...s, status: "accepted" }));
      setSel(s.id);
      ok(
        <>
          طلب {s.id} اتقبل واتحول لإعلان مسودة ({deviceId}). اطلب رسوم الجدية من البايع على واتساب، وكمّل الإعلان.{" "}
          <Link href={routes.admin.editDevice(deviceId)} style={{ color: "inherit", textDecoration: "underline" }}>
            كمّل الإعلان
          </Link>
        </>,
      );
    },
    requestPhotos: (what: string) => {
      updateSubmission(s.id, { status: "follow_up", ...contactPatch(s) }, { text: `اتطلب من البايع: ${what}`, tone: "warn" });
      ok(`اتبعت للبايع طلب ${what} — الطلب بقى «محتاج متابعة».`);
    },
    schedule: (date: string, slot: string, tech: string) => {
      const inspId = addInspection({
        scheduledAt: scheduledIso(date, slot),
        submissionId: s.id,
        title: s.details,
        deviceType: s.deviceType,
        governorate: s.governorate,
        location: HQ, // always at headquarters (ADMIN_SPEC §4)
        technician: tech,
        time: slot,
        kind: "pre_publish",
        deviceId: s.deviceId,
      });
      updateSubmission(s.id, { status: "follow_up", ...contactPatch(s) }, { text: `ميعاد فحص ${inspId} في المقر: ${date} · ${slot} · ${tech}`, tone: "info" });
      ok(
        <>
          اتحدد ميعاد الفحص في المقر {date} ({slot}) — بلّغ البايع يبعت الجهاز.{" "}
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
    if (s.sellerTrust !== "suspicious") setTab("follow_up");
    ok(`طلب ${s.id} رجع «محتاج متابعة».`);
  };

  const contacted = (s: Submission) => {
    if (s.firstContactAt) return;
    updateSubmission(s.id, { firstContactAt: iso() }, { text: "أول رسالة للبايع على واتساب — بداية مهلة الرد", tone: "info" });
  };

  const replied = (s: Submission) => {
    updateSubmission(s.id, { sellerRepliedAt: iso() }, { text: "البايع رد", tone: "ok" });
    ok(`اتسجل إن البايع رد على طلب ${s.id}.`);
  };

  /** No reply within the deadline → listing cancelled, fee kept (terms). */
  const cancelNoReply = (s: Submission) => {
    if (s.deviceId) {
      const d = state.devices.find((x) => x.id === s.deviceId);
      if (d && d.status !== "sold") updateDevice(d.id, { status: "hidden" });
    }
    updateSubmission(
      s.id,
      { status: "rejected", rejectReason: NO_REPLY_REASON, feeStatus: s.feeStatus === "paid" ? "forfeited" : s.feeStatus },
      { text: `اتلغى العرض: ${NO_REPLY_REASON}${s.feeStatus === "paid" ? " — الرسوم اتخصمت حسب الشروط" : ""}`, tone: "bad" },
    );
    if (s.sellerTrust !== "suspicious") setTab("rejected");
    setToast({ body: `طلب ${s.id} اتلغى (مفيش رد)${s.deviceId ? ` والإعلان ${s.deviceId} اتخفى` : ""}.`, tone: "bad" });
  };

  const trust = async (s: Submission, t: Submission["sellerTrust"]) => {
    if (!s.sellerId) return;
    try {
      await setSellerTrust(s.sellerId, t);
      if (t === "suspicious") setTab("spam");
      else if (tab === "spam") setTab(s.status);
      setSel(s.id);
      ok(t === "suspicious" ? `حساب ${s.fullName} اتعلّم «مشبوه» — طلباته اتنقلت لـ«مشبوه».` : t === "serious" ? `حساب ${s.fullName} اتعلّم «جاد».` : `اتشال «مشبوه» من حساب ${s.fullName}.`);
    } catch (e) {
      console.error(e);
      setToast({ body: "ما قدرناش نحفظ تقييم الحساب. جرّب تاني.", tone: "bad" });
    }
  };

  const fee = (s: Submission): FeeHandlers => ({
    save: (patch) => {
      updateSubmission(s.id, patch, patch.feeAmount !== s.feeAmount ? { text: `رسوم الجدية اتعدلت: ${fmt(patch.feeAmount ?? 0)} ج.م`, tone: "info" } : patch.feeReference ? { text: `اتسجل رقم التحويل (${patch.feeReference})`, tone: "info" } : undefined);
      ok("اتحفظ.");
    },
    requested: (amount) => {
      updateSubmission(s.id, { feeAmount: amount, feeRequestedAt: iso(), ...contactPatch(s) }, { text: `اتطلبت رسوم الجدية ${fmt(amount)} ج.م على واتساب`, tone: "info" });
    },
    paid: async (amount, method, reference) => {
      if (busy || !userId) return;
      setBusy(true);
      try {
        await recordSellerFee(supabaseBrowser(), { ...s, feeReference: reference }, amount, method, userId);
      } catch (e) {
        console.error(e);
        setToast({ body: "ما قدرناش نسجّل الدفع. جرّب تاني.", tone: "bad" });
        setBusy(false);
        return;
      }
      setBusy(false);
      const methodTxt = FEE_METHODS.find(([k]) => k === method)?.[1] ?? method;
      updateSubmission(
        s.id,
        { feeStatus: "paid", feeAmount: amount, feeReference: reference },
        { text: `رسوم الجدية ${fmt(amount)} ج.م وصلت (${methodTxt}${reference ? ` · ${reference}` : ""})`, tone: "ok" },
      );
      // The listing goes live once the fee arrives (ADMIN_SPEC §2).
      const d = s.deviceId ? state.devices.find((x) => x.id === s.deviceId) : undefined;
      const publish = d && (d.status === "draft" || d.status === "hidden");
      if (d && publish) updateDevice(d.id, { status: "published" });
      ok(
        <>
          الرسوم وصلت واتسجلت في المدفوعات{publish ? ` — الإعلان ${d.id} اتنشر.` : "."}{" "}
          {d ? (
            <Link href={routes.device(d.id)} style={{ color: "inherit", textDecoration: "underline" }}>
              شوف الإعلان
            </Link>
          ) : null}
        </>,
      );
    },
    close: (st) => {
      const amount = fmt(s.feeAmount ?? 0);
      updateSubmission(
        s.id,
        { feeStatus: st },
        st === "refunded" ? { text: `رسوم الجدية ${amount} ج.م اترجعت للبايع`, tone: "info" } : { text: `رسوم الجدية ${amount} ج.م اتخصمت حسب الشروط`, tone: "warn" },
      );
      ok(`طلب ${s.id}: رسوم الجدية — ${FEE[st].txt}.`);
    },
  });

  const open = p ? p.status === "new" || p.status === "follow_up" : false;

  return (
    <>
      <SubmissionArtDefs />
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › طلبات البيع الواردة</div>
        <h1 className="sb-h1" style={{ margin: 0, lineHeight: 1.3 }}>طلبات البيع الواردة</h1>
        <div style={{ color: "#4A5A56" }}>
          طلبات الدكاترة اللي عايزين يبيعوا أجهزتهم. راجع الطلب خلال 24 ساعة: اقبله وحدد رسوم الجدية، أو اطلب صور، أو حدد ميعاد فحص في المقر، أو ارفضه.
        </div>
      </div>

      {toast ? (
        <Toast tone={toast.tone} onClose={() => setToast(null)} closeClass="sb-act" floating>
          {toast.body}
        </Toast>
      ) : null}

      {!ready ? (
        <div className="ad-card" role="status" style={{ minHeight: 200, alignItems: "center", justifyContent: "center", color: "#4A5A56" }}>
          بنحمّل الطلبات…
        </div>
      ) : submissionsError ? (
        <div className="ad-card" role="alert" style={{ minHeight: 200, alignItems: "center", justifyContent: "center", textAlign: "center", color: "#7A1A14" }}>
          ما قدرناش نحمّل الطلبات دلوقتي. اتأكد من النت وحدّث الصفحة.
        </div>
      ) : (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <SubmissionList
          ref={listRef}
          tab={tab}
          counts={counts}
          onTab={pickTab}
          now={now}
          q={q}
          onQ={setQ}
          items={items}
          sel={sel}
          onPick={(id) => {
            setSel(id);
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
            <SubmissionInfo p={p} now={now} onReopen={() => reopen(p)} onContact={() => contacted(p)} onTrust={(t) => trust(p, t)} />

            {p.status !== "rejected" ? <ContactPanel p={p} now={now} onReplied={() => replied(p)} onCancel={() => cancelNoReply(p)} /> : null}

            {p.status === "accepted" || p.feeStatus !== "pending" ? <FeePanel key={`${p.id}-${p.feeStatus}`} p={p} h={fee(p)} /> : null}

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
      )}
    </>
  );
}
