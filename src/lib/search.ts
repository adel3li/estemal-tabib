// Admin search boxes: text (code, device, names) or a phone number typed any
// way (with spaces, +20, Arabic digits…).
const digitsOf = (s: string) => s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632)).replace(/[^0-9]/g, "").replace(/^20(?=1)/, "0");

export function matchesSearch(query: string, texts: (string | undefined | null)[], phones: (string | undefined | null)[] = []): boolean {
  const q = query.trim().replace(/^#/, "").toLowerCase();
  if (!q) return true;
  if (texts.some((t) => (t ?? "").toLowerCase().includes(q))) return true;
  const d = digitsOf(q);
  return d.length >= 4 && phones.some((p) => digitsOf(p ?? "").includes(d));
}
