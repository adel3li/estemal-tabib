"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEVICE_TYPES, parseNum } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import type { Condition, DeviceType, YesNoUnknown } from "@/lib/demo/types";
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
  const { addSubmission } = useDemo();
  const [f, setF] = useState<Form>(EMPTY_FORM);
  const [media, setMedia] = useState<Media>(EMPTY_MEDIA);
  const [tried, setTried] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const restored = useRef(false);

  // Restore the draft, then apply the URL prefill on top (it's the newer intent).
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const draft = loadDraft() ?? {};
    setF({ ...EMPTY_FORM, ...draft, acks: { ...EMPTY_FORM.acks, ...draft.acks }, ...fromQuery(q) });
  }, [q]);

  useEffect(() => {
    if (restored.current && !doneId) saveDraft(f);
  }, [f, doneId]);

  const set = useCallback((patch: Partial<Form>) => setF((prev) => ({ ...prev, ...patch })), []);

  // Errors show only after the first submit attempt, then update live as fields get fixed.
  const err: Errors = tried ? validate(f, media) : {};

  const submit = () => {
    setTried(true);
    const e = validate(f, media);
    const first = FIELD_ORDER.find((k) => e[k]);
    if (first) {
      const el = document.getElementById(fieldId(first));
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    const sale = parseNum(f.sale) || (parseNum(f.net) ? salePriceFromSellerNet(parseNum(f.net)) : 0);
    const id = addSubmission({
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
      condition: f.condition as Condition,
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
      // NewSubmission in the store still requires it (Omit & Partial intersection).
      feeReference: "",
    });
    clearDraft();
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

  if (doneId) return <SellSuccess id={doneId} onAgain={again} />;

  const errCount = Object.keys(err).length;

  return (
    <>
      <div style={{ maxWidth: 1200, boxSizing: "content-box", margin: "0 auto", padding: "20px 20px 0", fontSize: 14, color: "#4A5A56", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <Link href={routes.home}>الرئيسية</Link>
        <span aria-hidden="true">›</span>
        <span>اعرض جهازك للبيع</span>
      </div>

      <section style={{ maxWidth: 1200, boxSizing: "content-box", margin: "0 auto", padding: "16px 20px 72px", display: "flex", flexDirection: "column", gap: 24 }}>
        <SellHero />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <form noValidate onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
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
          <FeeBox f={f} onSubmit={submit} />
        </div>
      </section>
    </>
  );
}
