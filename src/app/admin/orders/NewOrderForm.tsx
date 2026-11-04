"use client";

import { useState } from "react";
import { BUSINESS } from "@/config/business";
import { GOVERNORATES, fmt, parseNum } from "@/lib/demo/labels";
import type { Device } from "@/lib/demo/types";
import { matchesSearch } from "@/lib/search";
import { PAY_METHODS, type NewOrder, type PayMethod } from "@/lib/orders/orders";

type Props = {
  /** Devices that can be ordered (published). */
  devices: Device[];
  busy: boolean;
  /** Look up a site account by email → its id (undefined = not found). */
  findAccount: (email: string) => Promise<string | undefined>;
  onCreate: (o: NewOrder, device: Device) => void;
  onCancel: () => void;
};

/**
 * «طلب جديد»: the team enters an order taken on WhatsApp (ADMIN_SPEC §5, §9).
 * Not in the design files — styled like the other admin forms.
 */
export function NewOrderForm({ devices, busy, findAccount, onCreate, onCancel }: Props) {
  const [deviceId, setDeviceId] = useState("");
  // Device picker: type the code (L-215) or part of the name (client, 4 Nov).
  const [find, setFind] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("1");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gov, setGov] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<PayMethod>("instapay");
  const [paidNow, setPaidNow] = useState(String(BUSINESS.buyerReservationDepositEGP));
  const [ref, setRef] = useState("");
  const [err, setErr] = useState("");
  const d = devices.find((x) => x.id === deviceId);
  const matches = devices.filter((x) => matchesSearch(find, [x.id, x.title, x.brand, x.model], []));

  const pick = (id: string) => {
    setDeviceId(id);
    const x = devices.find((y) => y.id === id);
    if (x) setPrice(String(x.price));
    setQty("1");
  };

  const submit = async () => {
    const p = Math.round(parseNum(price));
    const units = Math.max(1, Math.round(parseNum(qty)) || 1);
    const free = d?.available ?? 1;
    if (d && units > free) {
      setErr(`متاح ${free} بس من الجهاز ده.`);
      return;
    }
    const paid = Math.round(parseNum(paidNow));
    const digits = phone.replace(/[^0-9]/g, "");
    const missing = [
      !d && "الجهاز",
      !p && "السعر",
      !name.trim() && "اسم المشتري",
      digits.length < 10 && "موبايل المشتري",
      !gov && "المحافظة",
      !address.trim() && "العنوان",
    ].filter(Boolean);
    if (missing.length || !d) {
      setErr(`ناقص: ${missing.join("، ")}.`);
      return;
    }
    if (paid > p) {
      setErr("المدفوع أكبر من السعر.");
      return;
    }
    let buyerId: string | undefined;
    if (email.trim()) {
      buyerId = await findAccount(email.trim());
      if (!buyerId) {
        setErr("مفيش حساب على الموقع بالإيميل ده. سيبه فاضي لو المشتري ملوش حساب.");
        return;
      }
    }
    setErr("");
    onCreate(
      {
        deviceDbId: d.dbId ?? "",
        quantity: units,
        price: p,
        buyerId,
        buyerName: name.trim(),
        buyerPhone: digits,
        buyerGov: gov,
        buyerAddress: address.trim(),
        method,
        paidNow: paid,
        reference: ref.trim(),
        location: d.locationNow === "مقر الفحص" ? "في المقر" : d.source === "company" ? "في المقر" : "عند البايع",
      },
      d,
    );
  };

  return (
    <section className="ad-card" aria-labelledby="or-new-h" style={{ borderColor: "#9CCBC2", gap: 16 }}>
      <h2 id="or-new-h" className="ad-h" style={{ fontWeight: 700 }}>طلب جديد</h2>
      <div className="ad-hint">سجّل الطلب اللي جالك على واتساب. الجهاز هيبقى «محجوز» على الموقع لحد ما الطلب يخلص أو يتلغى.</div>
      <div className="ad-grid">
        <div className="ad-field" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="or-new-find">الجهاز</label>
          {d ? (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, border: "1px solid #9CCBC2", background: "#F1F8F6" }}>
              <b style={{ flex: "1 1 200px", overflowWrap: "anywhere" }}>{d.id} · {d.title} · {fmt(d.price)} ج.م</b>
              <button type="button" className="ad-btn ad-sec" onClick={() => { setDeviceId(""); setFind(""); }}>غيّر الجهاز</button>
            </div>
          ) : (
            <>
              <input
                id="or-new-find"
                type="search"
                className="ad-in"
                value={find}
                onChange={(e) => setFind(e.target.value)}
                placeholder="اكتب رقم الجهاز (L-215) أو جزء من اسمه"
                autoComplete="off"
                aria-describedby="or-new-find-n"
              />
              <div id="or-new-find-n" className="ad-hint">{matches.length ? `${matches.length} جهاز منشور` : "مفيش جهاز منشور بالبحث ده."}</div>
              <div role="listbox" aria-label="الأجهزة" style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto" }}>
                {matches.slice(0, 20).map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => pick(x.id)}
                    style={{ textAlign: "right", font: "inherit", padding: "10px 14px", borderRadius: 12, border: "1px solid #DCE3DF", background: "#FFFFFF", cursor: "pointer", minHeight: 44 }}
                  >
                    <b>{x.id}</b> · {x.title} <span className="ad-hint">· {fmt(x.price)} ج.م · {x.governorate}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {d && (d.quantity ?? 1) > 1 ? (
          <label className="ad-field">
            الكمية (متاح {d.available ?? 1} من {d.quantity})
            <input
              type="text"
              inputMode="numeric"
              className="ad-in"
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
                const u = Math.max(1, Math.round(parseNum(e.target.value)) || 1);
                setPrice(String(d.price * u));
              }}
            />
          </label>
        ) : null}
        <label className="ad-field">
          {d && (d.quantity ?? 1) > 1 ? "إجمالي السعر (ج.م)" : "سعر البيع (ج.م)"}
          <input type="text" inputMode="numeric" className="ad-in" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label className="ad-field">
          اسم المشتري
          <input type="text" className="ad-in" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        </label>
        <label className="ad-field">
          موبايل المشتري
          <input type="tel" className="ad-in" dir="ltr" style={{ textAlign: "right" }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
        </label>
        <label className="ad-field">
          المحافظة
          <select className="ad-in" value={gov} onChange={(e) => setGov(e.target.value)}>
            <option value="">اختار…</option>
            {GOVERNORATES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="ad-field">
          عنوان التوصيل
          <input type="text" className="ad-in" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <label className="ad-field">
          إيميل حسابه على الموقع (اختياري)
          <input type="email" className="ad-in" dir="ltr" style={{ textAlign: "right" }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="عشان يتابع طلبه بنفسه" />
        </label>
        <label className="ad-field">
          طريقة الدفع
          <select className="ad-in" value={method} onChange={(e) => setMethod(e.target.value as PayMethod)}>
            {PAY_METHODS.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="ad-field">
          اتدفع دلوقتي (ج.م)
          <input type="text" inputMode="numeric" className="ad-in" value={paidNow} onChange={(e) => setPaidNow(e.target.value)} />
        </label>
        <label className="ad-field">
          رقم التحويل (لو فيه)
          <input type="text" className="ad-in" dir="ltr" style={{ textAlign: "right" }} value={ref} onChange={(e) => setRef(e.target.value)} />
        </label>
      </div>
      <div className="ad-hint">
        عربون الحجز {fmt(BUSINESS.buyerReservationDepositEGP)} ج.م بيتخصم من السعر. اكتب 0 لو لسه مدفعش، أو السعر كله لو دفع كامل.
      </div>
      {err ? (
        <div role="alert" style={{ padding: "10px 14px", borderRadius: 12, background: "#FBE9E7", color: "#B3261E", fontWeight: 600, fontSize: 14 }}>
          {err}
        </div>
      ) : null}
      <div className="or-acts">
        <button type="button" className="ad-btn ad-pri" disabled={busy} onClick={() => void submit()}>
          {busy ? "بنسجّل…" : "سجّل الطلب"}
        </button>
        <button type="button" className="ad-btn ad-sec" onClick={onCancel}>
          إلغاء
        </button>
      </div>
    </section>
  );
}
