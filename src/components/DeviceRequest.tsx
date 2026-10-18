"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/site";
import { Icon } from "./Icon";
import { btn } from "./ui";

const field = "min-h-11 w-full rounded-[10px] border border-dark-line bg-dark-2 px-3 text-white placeholder:text-dark-muted";

/** "Can't find what you're looking for?" banner (DeviceRequest in CLAUDE.md §4). */
export function DeviceRequest() {
  const [open, setOpen] = useState(false);
  const [deviceType, setDeviceType] = useState("");
  const [budget, setBudget] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = ["بدوّر على جهاز على استعمال طبيب", `الجهاز: ${deviceType}`, `الميزانية: ${budget || "-"}`].join("\n");
    window.open(whatsappUrl(text), "_blank", "noopener");
  }

  return (
    <div className="mt-2.5 flex flex-col gap-5 rounded-[22px] bg-dark p-6 text-white sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-[18px]">
        <div className="min-w-0 flex-[1_1_320px]">
          <div className="text-[22px] font-bold">مش لاقي الجهاز اللي بتدوّر عليه؟</div>
          <div className="text-dark-muted">قولنا الجهاز والميزانية، وهنبلغك أول ما يتعرض جهاز مناسب.</div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={`${btn.accent} min-h-12 px-[22px]`}>
            اطلب جهاز
          </button>
          <a
            href={whatsappUrl("السلام عليكم، بدوّر على جهاز")}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-dark-line px-[18px] font-semibold text-white hover:text-white"
          >
            <Icon name="chat" />
            واتساب
          </a>
        </div>
      </div>
      {open && (
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            الجهاز
            <input required value={deviceType} onChange={(e) => setDeviceType(e.target.value)} placeholder="مثال: أوتوكلاف Class B" className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            الميزانية
            <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="ج.م" className={field} />
          </label>
          <button type="submit" className={`${btn.accent} min-h-11`}>
            ابعت الطلب
          </button>
        </form>
      )}
    </div>
  );
}
