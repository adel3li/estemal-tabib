import { BUSINESS } from "@/config/business";

/**
 * wa.me link with a prefilled Arabic message.
 * TODO(open question §12.2): the real number. While it's a placeholder the
 * link opens WhatsApp's "choose a chat" screen with the message filled in.
 */
export function waLink(message: string, phone?: string): string {
  const raw = (phone ?? BUSINESS.contact.whatsapp).replace(/[^0-9]/g, "");
  const intl = raw.startsWith("0") ? `2${raw}` : raw; // 01x… → 201x…
  const text = encodeURIComponent(message);
  return intl ? `https://wa.me/${intl}?text=${text}` : `https://wa.me/?text=${text}`;
}
