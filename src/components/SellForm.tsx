"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/site";
import { btn } from "./ui";

const DEVICE_TYPES = ["يونيت أسنان", "أشعة", "أوتوكلاف", "إندو موتور", "أبيكس لوكيتور", "جهاز تاني"];

const field = "min-h-[46px] rounded-[10px] border border-field bg-surface px-3 font-normal";

/** No backend yet: the form hands the details to WhatsApp. */
export function SellForm() {
  const [type, setType] = useState(DEVICE_TYPES[0]);
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = [
      "عايز أعرض جهاز للبيع على استعمال طبيب",
      `نوع الجهاز: ${type}`,
      `الموديل وسنة الصنع: ${model || "-"}`,
      `السعر المطلوب: ${price ? `${price} ج.م` : "-"}`,
      "هبعت صور وفيديو للجهاز وهو شغال هنا.",
    ].join("\n");
    window.open(whatsappUrl(text), "_blank", "noopener");
  }

  return (
    <form onSubmit={submit} className="flex min-w-0 flex-col gap-3.5 rounded-[18px] bg-ground p-5 sm:p-[26px]">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        نوع الجهاز
        <select value={type} onChange={(e) => setType(e.target.value)} className={field}>
          {DEVICE_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        الموديل وسنة الصنع
        <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="مثال: [الموديل] — [السنة]" className={field} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        السعر المطلوب
        <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" placeholder="ج.م" className={field} />
      </label>
      <p className="m-0 rounded-xl border-[1.5px] border-dashed border-[#9FB2AB] p-4 text-center text-sm text-muted">
        هتبعت صور وفيديو للجهاز وهو شغال على واتساب بعد ما تضغط «اعرض جهازك».
      </p>
      <button type="submit" className={`${btn.accent} min-h-[50px] text-[17px]`}>
        اعرض جهازك
      </button>
    </form>
  );
}
