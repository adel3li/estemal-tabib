import { SITE, whatsappUrl } from "@/lib/site";
import { Icon } from "./Icon";
import { btn } from "./ui";

export function Footer() {
  return (
    <footer className="bg-dark text-dark-muted">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-5 px-4 py-10 sm:px-5">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold text-white">{SITE.name}</span>
          <span>{SITE.slogan}</span>
        </div>
        <a href={whatsappUrl("السلام عليكم، عندي سؤال عن استعمال طبيب")} target="_blank" rel="noopener" className={btn.accent}>
          <Icon name="chat" />
          كلمنا على واتساب
        </a>
      </div>
    </footer>
  );
}
