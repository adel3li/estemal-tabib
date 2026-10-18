// Shared class strings for buttons and chips (radius 12–14px, 44px+ targets).
export const btn = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-[18px] py-2.5 font-semibold text-white hover:bg-primary-hover hover:text-white",
  outline:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-field bg-surface px-[18px] py-2.5 font-semibold text-ink hover:border-primary hover:text-ink",
  accent:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-[18px] py-2.5 font-bold text-ink hover:bg-[#E0922A] hover:text-ink",
};

export function chip(on: boolean) {
  return [
    "min-h-11 rounded-full border px-4 py-1 text-sm font-semibold cursor-pointer",
    on ? "border-primary bg-primary text-white" : "border-field bg-surface text-ink hover:border-primary",
  ].join(" ");
}
