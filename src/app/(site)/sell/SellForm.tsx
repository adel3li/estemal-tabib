"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEVICE_TYPES, parseNum } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import type { Condition, DeviceType, YesNoUnknown } from "@/lib/demo/types";
import { useAuth } from "@/lib/auth/AuthProvider";
import { loginHref } from "@/lib/auth/next";
import { routes } from "@/lib/routes";
import { salePriceFromSellerNet, sellerNetFromSalePrice } from "@/config/business";
import {
  clearDraft,
  EMPTY_FORM,
  FIELD_ORDER,
  fieldId,
  loadDraft,
  normalizePhone,
  saveDraft,
  validate,
  type Errors,
  type Media,
  type SellForm as Form,
} from "./form";
import { FeeBox, SectionAcks } from "./SectionAcks";
import { SectionCondition } from "./SectionCondition";
import { SectionContact } from "./SectionContact";
import { SectionDevice } from "./SectionDevice";
import { SectionMedia } from "./SectionMedia";
import { SectionPrice } from "./SectionPrice";
import { SellHero } from "./SellHero";
import { saveSubmission } from "./save";
import { SellSuccess } from "./SellSuccess";

const EMPTY_MEDIA: Media = { photos: [], video: null, extras: [] };

/** ?type=&details=&price= from the home page quick form. */
function fromQuery(q: URLSearchParams): Partial<Form> {
  const out: Partial<Form> = {};
  const type = q.get("type");
  if (type && DEVICE_TYPES.some((t) => t.id === type)) out.deviceType = type as DeviceType;
  const details = q.get("details");
  if (details) out.details = details.slice(0, 200);
  const price = parseNum(q.get("price") ?? "");
  if (price) {
    out.sale = String(Math.round(price));
    out.net = String(sellerNetFromSalePrice(price));
  }
  return out;
}

export function SellForm() {
  const q = useSearchParams();
  const router = useRouter();
  const { addSubmission } = useDemo();
  const auth = useAuth();
  const [f, setF] = useState<Form>(EMPTY_FORM);
  const [media, setMedia] = useState<Media>(EMPTY_MEDIA);
  const [tried, setTried] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [dbId, setDbId] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState("");
  const [restoredDraft, setRestoredDraft] = useState(false);
  const restored = useRef(false);
  const prefilled = useRef(false);

  // Restore the draft (e.g. after the login redirect), then apply the URL
  // prefill on top (it's the newer intent).
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const draft = loadDraft() ?? {};
    setRestoredDraft(Object.keys(draft).length > 0);
    setF({ ...EMPTY_FORM, ...draft, acks: { ...EMPTY_FORM.acks, ...draft.acks }, ...fromQuery(q) });
  }, [q]);

  // Fill the seller section from the profile — only fields that are still empty.
  const { profile } = auth;
  useEffect(() => {
    if (prefilled.current || !profile || !restored.current) return;
    prefilled.current = true;
    setF((p) => ({
      ...p,
      fullName: p.fullName || profile.full_name || "",
      phone: p.phone || profile.phone || "",
      governorate: p.fullName || p.phone ? p.governorate : profile.governorate || p.governorate,
      pickupAddress: p.pickupAddress || profile.address || "",
    }));
  }, [profile]);

  useEffect(() => {
    if (restored.current && !doneId) saveDraft(f);
  }, [f, doneId]);

  const set = useCallback((patch: Partial<Form>) => setF((prev) => ({ ...prev, ...patch })), []);

  // Errors show only after the first submit attempt, then update live as fields get fixed.
  const err: Errors = tried ? validate(f, media) : {};

  const submit = async () => {
    if (sending) return;
    setTried(true);
    setSendErr("");
    const e = validate(f, media);
    const first = FIELD_ORDER.find((k) => e[k]);
    if (first) {
      const el = document.getElementById(fieldId(first));
      if (el) {
        // Scroll the whole field (label + input + message) under the sticky header (~70px).
        const box = el.closest(".sl-field, .sl-sub, fieldset") ?? el;
        const top = box.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        el.focus({ preventScroll: true });
      }
      return;
    }
    // Session ran out while filling the form? The draft is already saved —
    // sign in again and come back to it.
    if (!auth.userId) {
      saveDraft(f);
      router.push(loginHref(routes.sell));
      return;
    }
    setSending(true);
    const res = await saveSubmission(f, auth.userId);
    setSending(false);
    if ("error" in res) {
      if (res.auth) {
        saveDraft(f);
        router.push(loginHref(routes.sell));
        return;
      }
      setSendErr(res.error);
      return;
    }
    // Mirror into the demo store under the same number so the (still demo)
    // admin pages show it — remove in Step 7 when the admin reads the database.
    const sale = parseNum(f.sale) || (parseNum(f.net) ? salePriceFromSellerNet(parseNum(f.net)) : 0);
    const id = addSubmission({
      id: res.code,
      fullName: f.fullName.trim(),
      phone: normalizePhone(f.phone),
      governorate: f.governorate,
      pickupAddress: f.pickupAddress.trim(),
      lat: f.lat,
      lng: f.lng,
      deviceType: f.deviceType,
      brand: f.brand.trim(),
      details: f.details.trim(),
      year: "",
      accessories: f.accessories.trim(),
      saleReason: f.saleReason.trim(),
      condition: f.wantsRepair ? "c" : (f.condition as Condition),
      wantsRepair: f.wantsRepair,
      repairDescription: f.wantsRepair ? f.repairDescription.trim() : "",
      hasWarranty: f.warranty === "yes",
      warrantyRemaining: f.warranty === "yes" ? f.warrantyRemaining.trim() : "",
      hasBox: f.box === "yes",
      repairedBefore: f.repaired as YesNoUnknown,
      repairedDetails: f.repaired === "yes" ? f.repairedDetails.trim() : "",
      defects: f.defects.trim(),
      keepLocation: f.keepLocation,
      salePrice: sale,
      photos: media.photos.length,
      hasVideo: !!media.video,
      accessoryPhotos: media.extras.length,
      feeReference: "",
    });
    clearDraft();
    setDbId(res.id);
    setDoneId(id);
    window.scrollTo({ top: 0 });
  };

  const again = () => {
    setF(EMPTY_FORM);
    setMedia(EMPTY_MEDIA);
    setTried(false);
    setDoneId(null);
    window.scrollTo({ top: 0 });
  };

  if (doneId) return <SellSuccess id={doneId} dbId={dbId} onAgain={again} />;

  const errCount = Object.keys(err).length;

  return (
    <>
      <div className="sl-crumb">
        <Link href={routes.home}>الرئيسية</Link>
        <span aria-hidden="true">›</span>
        <span>اعرض جهازك للبيع</span>
      </div>

      <section className="sl-wrap">
        <SellHero />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {restoredDraft ? (
            <div role="status" style={{ padding: "12px 16px", borderRadius: 14, background: "#E3F0ED", border: "1px solid #9CCBC2", color: "#0B4A44", fontWeight: 600, fontSize: 15 }}>
              رجّعنالك البيانات اللي كنت كتبتها. الصور والفيديو بس محتاج تضيفهم تاني.
            </div>
          ) : null}
          <form noValidate onSubmit={(e) => { e.preventDefault(); void submit(); }} style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionContact f={f} set={set} err={err} />
            <SectionDevice f={f} set={set} err={err} />
            <SectionCondition f={f} set={set} err={err} />
            <SectionMedia media={media} setMedia={setMedia} err={err} />
            <SectionPrice f={f} set={set} err={err} />
            <SectionAcks f={f} set={set} err={err} />
          </form>
          {errCount ? (
            <div role="alert" style={{ padding: "12px 16px", borderRadius: 14, background: "#FCEBEA", border: "1px solid #E8B4B0", color: "#8C1D17", fontWeight: 600, fontSize: 15 }}>
              فيه {errCount === 1 ? "خانة واحدة محتاجة" : `${errCount} خانات محتاجين`} تتظبط قبل ما تبعت. علّمناهم باللون الأحمر.
            </div>
          ) : null}
          {sendErr ? (
            <div role="alert" style={{ padding: "12px 16px", borderRadius: 14, background: "#FCEBEA", border: "1px solid #E8B4B0", color: "#8C1D17", fontWeight: 600, fontSize: 15 }}>
              {sendErr}
            </div>
          ) : null}
          <FeeBox f={f} onSubmit={() => void submit()} sending={sending} />
        </div>
      </section>
    </>
  );
}
