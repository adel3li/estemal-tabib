import type { MaintenanceMonths } from "@/lib/types";
import { Icon, type IconName } from "./Icon";

/** The three warranty levels on every device (CLAUDE.md §2.2). */
export function WarrantyCard({ maintenanceMonths }: { maintenanceMonths: MaintenanceMonths }) {
  const rows: { icon: IconName; label: string; value: string; highlight?: boolean }[] = [
    { icon: "swap", label: "استبدال أو استرجاع", value: "14 يوم" },
    { icon: "shield", label: "ضمان تشغيل", value: "14 يوم" },
    { icon: "wrench", label: "صيانة", value: `${maintenanceMonths} شهور`, highlight: true },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="bg-ground px-4 py-3 font-bold">الضمان على الجهاز ده</div>
      {rows.map((r) => (
        <div
          key={r.label}
          className={`flex items-center gap-3 border-t border-line-soft px-4 py-3 ${r.highlight ? "bg-primary-soft" : ""}`}
        >
          <Icon name={r.icon} size={22} className="text-primary" />
          <span className="flex-1">{r.label}</span>
          <span className={r.highlight ? "font-bold text-primary" : "font-semibold"}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function EscrowNote({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-ground px-3.5 py-3 text-[15px]">
      <Icon name="lock" size={22} className="mt-0.5 flex-none text-primary" />
      <span>{children ?? "فلوسك محفوظة عندنا لحد ما تستلم وتجرب. البايع مش بياخدها غير بعد تأكيدك."}</span>
    </div>
  );
}
