import Link from "next/link";
import { SITE } from "@/lib/site";
import { Icon } from "./Icon";
import { btn } from "./ui";

const NAV = [
  { href: "/devices", label: "الأجهزة" },
  { href: "/#how", label: "إزاي بنشتغل" },
  { href: "/#warranty", label: "الضمان" },
  { href: "/#sell", label: "بيع جهازك" },
  { href: "/#faq", label: "أسئلة شائعة" },
];

export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
        <Link href="/" className="flex items-center gap-2.5 text-ink hover:text-ink">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white">
            <Icon name="tooth" size={22} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-bold">{SITE.name}</span>
            <span className="text-xs text-muted">{SITE.tagline}</span>
          </span>
        </Link>
        <nav aria-label="القائمة الرئيسية" className="hidden flex-wrap gap-[22px] font-medium lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink hover:text-primary">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/orders/1024" className={btn.outline}>
            تابع طلبك
          </Link>
          <Link href="/devices" className={btn.primary}>
            اشتري جهاز
          </Link>
        </div>
      </div>
    </header>
  );
}
