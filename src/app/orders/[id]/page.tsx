import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { InspectionReportView } from "@/components/InspectionReportView";
import { OrderTracker } from "@/components/OrderTracker";
import { btn } from "@/components/ui";
import { ORDERS, getListing, getOrder, getReport, orderSteps } from "@/lib/data";
import { formatPrice, whatsappUrl } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return ORDERS.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `متابعة الطلب ${(await params).id}` };
}

export default async function OrderPage({ params }: Props) {
  const order = getOrder((await params).id);
  if (!order) notFound();
  const listing = getListing(order.listingId);
  if (!listing) notFound();
  const report = getReport(listing.id);

  const aside = (
    <>
      <div className="flex flex-col gap-2.5 rounded-[20px] bg-dark p-6 text-white">
        <div className="flex items-center gap-2.5 text-lg font-bold">
          <Icon name="lock" size={24} className="text-accent" />
          فلوسك فين دلوقتي؟
        </div>
        <div className="text-[26px] font-bold">{order.amountEgp === null ? "[المبلغ] ج.م" : formatPrice(order.amountEgp)}</div>
        <div className="text-dark-muted">محفوظة عند استعمال طبيب. مش هتتحول للبايع غير بعد ما تستلم وتجرب.</div>
      </div>

      <div className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-surface p-[22px]">
        <div className="font-bold">ضمانك على الجهاز</div>
        {[
          ["استبدال أو استرجاع", "14 يوم"],
          ["ضمان تشغيل", "14 يوم"],
          ["صيانة", `${listing.maintenanceMonths} شهور`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-muted">{label}</span>
            <span className="font-semibold">{value}</span>
          </div>
        ))}
        <div className="text-[13px] text-muted">المدد بتبدأ من يوم الاستلام.</div>
      </div>

      <div id="help" className="flex scroll-mt-4 flex-col gap-3 rounded-[20px] border border-line bg-surface p-[22px]">
        <div className="font-bold">محتاج مساعدة؟</div>
        <a href={whatsappUrl(`السلام عليكم، بخصوص طلب رقم ${order.id}`)} target="_blank" rel="noopener" className={`${btn.accent} min-h-12`}>
          <Icon name="chat" />
          كلمنا على واتساب
        </a>
      </div>
    </>
  );

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 pt-[22px] pb-[72px] sm:px-5">
        <nav aria-label="مسار الصفحة" className="text-sm text-muted">
          <Link href="/">الرئيسية</Link> / <Link href={`/devices/${listing.id}`}>{listing.title}</Link> / متابعة طلبك
        </nav>
        <OrderTracker
          order={order}
          listingTitle={listing.title}
          steps={orderSteps(listing.inspectionState)}
          report={report}
          maintenanceMonths={listing.maintenanceMonths}
          aside={aside}
        >
          {report && <InspectionReportView title={listing.title} report={report} />}
        </OrderTracker>
      </main>
      <Footer />
    </>
  );
}
