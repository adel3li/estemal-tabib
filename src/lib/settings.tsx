"use client";

// «الإعدادات» (docs/ADMIN_SPEC.md §8): official WhatsApp number, transfer
// details and social links, edited from the dashboard (table site_settings).
// Loaded once in the browser; until then (or if a field is empty) the
// placeholders from src/config/business.ts are shown.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { BUSINESS } from "@/config/business";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SUPABASE_URL } from "@/lib/supabase/env";
import { waLink } from "@/lib/whatsapp";

export type SiteSettings = {
  whatsapp: string;
  email: string;
  instapay: string;
  vodafone_cash: string;
  facebook: string;
  instagram: string;
  tiktok: string;
};
export const SETTINGS_COLUMNS = "whatsapp, email, instapay, vodafone_cash, facebook, instagram, tiktok";

const EMPTY: SiteSettings = { whatsapp: "", email: "", instapay: "", vodafone_cash: "", facebook: "", instagram: "", tiktok: "" };

type Api = {
  /** Raw values (empty = not set yet). */
  raw: SiteSettings;
  /** For display: value or the placeholder. */
  whatsapp: string;
  email: string;
  /** «InstaPay: … · فودافون كاش: …» (or the placeholder). */
  transfer: string;
  social: { label: string; href: string }[];
  /** wa.me link to the official number (or the customer's `phone`). */
  wa: (message: string, phone?: string) => string;
  reload: () => void;
};

const Ctx = createContext<Api | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<SiteSettings>(EMPTY);
  const load = useCallback(() => {
    if (!SUPABASE_URL) return;
    supabaseBrowser()
      .from("site_settings")
      .select(SETTINGS_COLUMNS)
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setRaw(Object.fromEntries(Object.entries(EMPTY).map(([k]) => [k, (data as Record<string, string | null>)[k] ?? ""])) as SiteSettings);
      });
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const api = useMemo<Api>(() => {
    const whatsapp = raw.whatsapp.trim() || BUSINESS.contact.whatsapp;
    const transferParts = [raw.instapay.trim() && `InstaPay: ${raw.instapay.trim()}`, raw.vodafone_cash.trim() && `فودافون كاش: ${raw.vodafone_cash.trim()}`].filter(Boolean);
    const social = (
      [
        ["فيسبوك", raw.facebook],
        ["إنستجرام", raw.instagram],
        ["تيك توك", raw.tiktok],
      ] as const
    )
      .filter(([, v]) => v.trim())
      .map(([label, v]) => ({ label, href: v.trim().startsWith("http") ? v.trim() : `https://${v.trim()}` }));
    return {
      raw,
      whatsapp,
      email: raw.email.trim() || BUSINESS.contact.email,
      transfer: transferParts.length ? transferParts.join(" · ") : BUSINESS.feeTransferDetails,
      social,
      wa: (message, phone) => waLink(message, phone ?? whatsapp),
      reload: load,
    };
  }, [raw, load]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useSettings(): Api {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings must be used inside <SettingsProvider>");
  return v;
}
