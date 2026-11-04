import { BUSINESS } from "@/config/business";

/**
 * wa.me link with a prefilled Arabic message.
 * Default number: BUSINESS.contact.whatsapp (or «الإعدادات» via useSettings().wa).
 * With a placeholder the link opens WhatsApp's "choose a chat" screen.
 */
export function waLink(message: string, phone?: string): string {
  const raw = (phone ?? BUSINESS.contact.whatsapp)
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[^0-9]/g, "");
  const intl = raw.startsWith("0") ? `2${raw}` : raw; // 01x… → 201x…
  const text = encodeURIComponent(message);
  // Placeholders like «[01xxxxxxxxx]» leave too few digits — open WhatsApp without a number.
  return intl.length >= 11 ? `https://wa.me/${intl}?text=${text}` : `https://wa.me/?text=${text}`;
}
