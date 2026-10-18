import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { InspectionBadge } from "@/components/InspectionBadge";
import { OrderTracker } from "@/components/OrderTracker";
import { btn } from "@/components/ui";
import { ORDERS, getListing, getOrder, orderSteps } from "@/lib/data";
import { formatPrice, whatsappUrl } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return ORDERS.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `طلب رقم ${(await params).id}` };
}

export default async function OrderPage({ params }: Props) {
  const order = getOrder((await params).id);
  if (!order) notFound();
  const listing = getListing(order.listingId);
  if (!listing) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 pt-[22px] pb-[72px] sm:px-5">
        <nav aria-label="مسار الصفحة" className="text-sm text-muted">
          <Link href="/">الرئيسية</Link> / تابع طلبك
        </nav>
        <div className="mt-4 mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="m-0 text-[28px] leading-snug sm:text-[34px]">طلب رقم {order.id}</h1>
            <div className="flex flex-wrap items-center gap-2.5 text-muted">
              <Link href={`/devices/${listing.id}`} className="font-semibold">
                {listing.title}
              </Link>
              <InspectionBadge state={listing.inspectionState} size="sm" withIcon={false} />
            </div>
          </div>
          <span className="text-2xl font-bold">{formatPrice(order.amountEgp)}</span>
        </div>

        <div className="flex flex-wrap items-start gap-7">
          <section
            aria-label="حالة الطلب"
            className="min-w-0 flex-[999_1_560px] rounded-3xl border border-line bg-surface p-5 sm:p-[34px]"
          >
            <h2 className="mt-0 mb-6 text-2xl">حالة الطلب</h2>
            <OrderTracker order={order} steps={orderSteps(listing.inspectionState)} />
          </section>

          <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
            <div className="flex flex-col gap-2.5 rounded-[20px] bg-dark p-[22px] text-white">
              <div className="flex items-center gap-2.5 text-lg font-bold">
                <Icon name="lock" size={22} className="text-accent" />
                فلوسك فين دلوقتي؟
              </div>
              <p className="m-0 text-dark-muted">
                المبلغ محفوظ عندنا. مش هيتحول للبايع غير بعد ما تستلم الجهاز، وتخلص فترة التجربة، وتأكّد بنفسك.
              </p>
              <p className="m-0 text-dark-muted">لو التقرير مش مطمّنك، تقدر تلغي دلوقتي وفلوسك ترجعلك كاملة.</p>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-line bg-surface">
              <div className="bg-ground px-[18px] py-3 font-bold">مواعيد الضمان</div>
              {[
                ["استبدال أو استرجاع", "14 يوم من الاستلام"],
                ["ضمان تشغيل", "14 يوم من الاستلام"],
                ["صيانة", `${listing.maintenanceMonths} شهور من الاستلام`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 border-t border-line-soft px-[18px] py-3">
                  <span>{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
              <div className="border-t border-line-soft px-[18px] py-3 text-sm text-muted">
                التواريخ بتتحدد يوم ما تستلم الجهاز.
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[20px] border border-line bg-surface p-[22px]">
              <div className="font-bold">محتاج مساعدة؟</div>
              <p className="m-0 text-[15px] text-muted">كلمنا في أي وقت على واتساب، ومعاك رقم الطلب.</p>
              <a href={whatsappUrl(`السلام عليكم، بخصوص طلب رقم ${order.id}`)} target="_blank" rel="noopener" className={btn.outline}>
                <Icon name="chat" />
                كلمنا على واتساب
              </a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
