// Fee transfer reference (InstaPay / bank): digits only (client request, Nov 2026).

/** «١٢٣ 456-789» → «123456789». Arabic-Indic and Persian digits become Latin. */
export function transferDigits(input: string): string {
  return input
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/\D/g, "");
}

export const TRANSFER_MIN_DIGITS = 6;

/** Error message, or "" when the reference looks fine. */
export function transferError(ref: string): string {
  if (!ref) return "اكتب رقم العملية اللي ظهرلك بعد التحويل (أرقام بس)";
  if (ref.length < TRANSFER_MIN_DIGITS) return `رقم العملية قصير. اكتبه كامل زي ما ظاهر في رسالة التحويل (${TRANSFER_MIN_DIGITS} أرقام على الأقل)`;
  return "";
}
