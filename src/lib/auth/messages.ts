// Arabic copy for Supabase auth errors (Egyptian, short). See DECISIONS.md.

export function authErrorAr(err: { code?: string; status?: number; message?: string } | null): string {
  if (!err) return "";
  const code = err.code ?? "";
  if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit" || err.status === 429)
    return "طلبت أكواد كتير في وقت قصير. استنى شوية وجرّب تاني.";
  if (code === "otp_expired" || code === "invalid_credentials" || /token|otp/i.test(err.message ?? ""))
    return "الكود غلط أو خلص وقته. اتأكد منه أو اطلب كود جديد.";
  if (code === "email_address_invalid" || code === "validation_failed") return "اكتب إيميل صحيح.";
  if (code === "signup_disabled") return "التسجيل مقفول دلوقتي. كلمنا على واتساب.";
  return "حصلت مشكلة في الاتصال. جرّب تاني بعد شوية.";
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
