/** Why we're asking them to sign in, from where they were going. */
export function reasonFor(next: string): string {
  if (next.startsWith("/sell")) return "ادخل حسابك الأول علشان تعرض جهازك. اللي كتبته في الفورم محفوظ.";
  if (next.startsWith("/request")) return "ادخل حسابك الأول علشان تبعت طلبك. اللي كتبته محفوظ.";
  if (next.startsWith("/admin")) return "لوحة التحكم للفريق بس. ادخل بحساب الفريق.";
  return "ادخل حسابك علشان تكمّل.";
}
