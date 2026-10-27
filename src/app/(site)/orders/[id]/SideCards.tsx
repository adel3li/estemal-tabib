import { BUSINESS } from "@/config/business";
import { fmt } from "@/lib/demo/labels";
import type { Order } from "@/lib/demo/orders";
import { waLink } from "@/lib/whatsapp";
import { HelpIcon, LockIcon, RefreshIcon, ShieldIcon, WaIcon, WrenchIcon } from "./art";

export function SideCards({ o }: { o: Order }) {
  const cancelled = o.status !== "active";
  const t = BUSINESS.trialDays;
  const rows = [
    { Icon: RefreshIcon, label: "استبدال أو استرجاع", val: `${t} أيام` },
    { Icon: ShieldIcon, label: "ضمان تشغيل", val: `${t} أيام` },
    { Icon: WrenchIcon, label: "صيانة", val: `${o.maint} شهور` },
  ];
  return (
    <aside style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88 }}>
      <div style={{ position: "relative", overflow: "hidden", padding: 24, borderRadius: 24, background: "#0F2A26", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ position: "absolute", left: -24, bottom: -28, opacity: 0.07, color: "#FFFFFF" }}><LockIcon size={140} width={1} /></span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 18 }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(242, 163, 58, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LockIcon stroke="#F2A33A" />
          </span>
          فلوسك فين دلوقتي؟
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.3 }}>
          {fmt(o.amount)} <span style={{ fontSize: 17, fontWeight: 600, color: "#C3D3CE" }}>ج.م</span>
        </div>
        <div style={{ color: "#C3D3CE", position: "relative" }}>
          {cancelled
            ? "الطلب اتلغى، والمبلغ كله راجعلك بنفس طريقة الدفع."
            : `محفوظة عند استعمال طبيب لمدة ${t} أيام من يوم ما تستلم الجهاز، وبعدها بتتحول للبايع.`}
        </div>
      </div>

      <div style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", background: "#F5F7F4", fontWeight: 700 }}>ضمانك على الجهاز</div>
        {rows.map(({ Icon, label, val }) => (
          <div key={label} style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #E5EBE8" }}>
            <Icon />
            <span style={{ flex: 1, color: "#4A5A56" }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{val}</span>
          </div>
        ))}
        <div style={{ padding: "10px 20px 14px", fontSize: 13, color: "#4A5A56", borderTop: "1px solid #E5EBE8" }}>المدد بتبدأ من يوم الاستلام.</div>
      </div>

      <div id="help" style={{ padding: 22, borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 12, scrollMarginTop: 88 }}>
        <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}><HelpIcon />محتاج مساعدة؟</div>
        <a
          href={waLink(`أهلاً، محتاج مساعدة في طلب رقم ${o.id} (${o.device}).`)}
          target="_blank"
          rel="noopener noreferrer"
          className="ot-amber"
          style={{ minHeight: 48, borderRadius: 12, background: "#F2A33A", color: "#12221F", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <WaIcon />
          كلمنا على واتساب
        </a>
      </div>
    </aside>
  );
}
