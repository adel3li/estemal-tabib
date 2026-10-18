import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { MobileBuyBar } from "@/components/MobileBuyBar";
import { Icon } from "@/components/Icon";
import { INSPECTION_LABELS } from "@/components/InspectionBadge";
import { PlannedChecklist } from "@/components/InspectionChecklist";
import { InspectionReportView } from "@/components/InspectionReportView";
import { btn } from "@/components/ui";
import { EscrowNote, WarrantyCard } from "@/components/WarrantyCard";
import { CATEGORY_LABELS, CHECKLIST_TEMPLATES, LISTINGS, getListing, getReport, getSeller } from "@/lib/data";
import { brandModel, formatPrice, formatYear, whatsappUrl } from "@/lib/site";
import type { Listing } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = getListing((await params).id);
  return listing ? { title: `${listing.title} (${INSPECTION_LABELS[listing.inspectionState]})` } : {};
}

export default async function ListingPage({ params }: Props) {
  const listing = getListing((await params).id);
  if (!listing) notFound();
  const inspected = listing.inspectionState === "inspected";
  const report = inspected ? getReport(listing.id) : undefined;
  const seller = getSeller(listing.sellerId);
  const categoryLabel = CATEGORY_LABELS[listing.category];

  return (
    <>
      <Header />
      <main>
        <nav aria-label="مسار الصفحة" className="mx-auto max-w-[1200px] px-4 pt-[22px] text-sm text-muted sm:px-5">
          <Link href="/">الرئيسية</Link> / <Link href={`/devices?cat=${listing.category}`}>{categoryLabel}</Link> /{" "}
          {listing.title}
        </nav>

        <section className="mx-auto flex max-w-[1200px] flex-wrap items-start gap-8 px-4 pt-5 pb-10 sm:px-5">
          <div className="min-w-0 flex-[999_1_560px]">
            <Gallery listing={listing} hasDefect={(report?.disclosedDefects.length ?? 0) > 0} />
          </div>

          <aside className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-5 sm:p-[26px]">
              <div>
                <h1 className="m-0 text-2xl leading-snug sm:text-[28px]">
                  {listing.title} — {brandModel(listing)}
                </h1>
                <div className="text-[15px] text-muted">
                  سنة الصنع {formatYear(listing.year)}
                  {inspected && <> · بلد المنشأ {listing.originCountry ?? "[البلد]"}</>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[30px] font-bold">{formatPrice(listing.priceEgp)}</span>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-[13px] font-semibold text-primary">
                  في نطاق السعر العادل للسوق
                </span>
              </div>

              {!inspected && (
                <div className="flex flex-col gap-1.5 rounded-2xl bg-info-soft p-4">
                  <div className="font-bold text-info-ink">لو الجهاز مطلعش مطابق في الفحص، فلوسك بترجعلك كاملة.</div>
                  <div className="text-[15px] text-[#2D4566]">
                    الفحص بيتم عند البايع خلال [عدد الأيام] من طلبك، وتقرير الفحص بيوصلك قبل الشحن.
                  </div>
                </div>
              )}

              <WarrantyCard maintenanceMonths={listing.maintenanceMonths} />
              {inspected && <EscrowNote />}

              <Link href="/orders/1024" className={`${btn.primary} min-h-[54px] rounded-[14px] text-lg font-bold max-lg:hidden`}>
                {inspected ? "اطلب الجهاز" : "اطلب الجهاز وابدأ الفحص"}
              </Link>
              <a
                href={whatsappUrl(`السلام عليكم، عندي سؤال عن: ${listing.title} (${listing.id})`)}
                target="_blank"
                rel="noopener"
                className={`${btn.outline} min-h-12 rounded-[14px] max-lg:hidden`}
              >
                <Icon name="chat" />
                اسأل على واتساب
              </a>
            </div>

            <div className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-surface px-[22px] py-5 text-[15px]">
              {seller?.verifiedDentist && (
                <div className="flex items-center gap-2.5 font-bold">
                  <Icon name="doctor" size={22} className="text-primary" />
                  البايع: دكتور أسنان موثّق
                </div>
              )}
              <div className="text-muted">سبب البيع: {listing.sellReason ?? "[سبب البيع]"}</div>
              {inspected && (
                <div className="flex items-center gap-2.5 text-muted">
                  <Icon name="truck" />
                  توصيل وتركيب لحد العيادة — [المدة / المحافظات]
                </div>
              )}
            </div>
          </aside>
        </section>

        {report ? (
          <div className="mx-auto max-w-[1200px] px-4 pb-[72px] sm:px-5">
            <InspectionReportView title={listing.title} report={report} />
          </div>
        ) : <OnOrderSections listing={listing} />}
      </main>
      <Footer />
      <MobileBuyBar listing={listing} />
    </>
  );
}

const AFTER_ORDER = [
  { text: "تدفع، والفلوس بتتحفظ عندنا", info: false },
  { text: "نفحص الجهاز عند البايع", info: true },
  { text: "تقرير الفحص يوصلك وتأكّد", info: true },
  { text: "نشحن لعيادتك وتبدأ فترة التجربة", info: false },
];

function OnOrderSections({ listing }: { listing: Listing }) {
  return (
    <>
      <section id="checks" className="mx-auto max-w-[1200px] px-4 pb-10 sm:px-5">
        <div className="flex flex-col gap-[22px] rounded-3xl border border-line bg-surface p-5 sm:p-[34px]">
          <div>
            <h2 className="m-0 text-2xl sm:text-[28px]">إيه اللي هنفحصه قبل ما الجهاز يتشحن لك</h2>
            <div className="text-muted">دي قائمة الفحص اللي هتتطبق على الجهاز عند البايع، ونتيجتها هتوصلك في تقرير كامل.</div>
          </div>
          <PlannedChecklist items={CHECKLIST_TEMPLATES[listing.category]} />
        </div>
      </section>
      <section className="mx-auto max-w-[1200px] px-4 pb-[72px] sm:px-5">
        <div className="flex flex-col gap-[18px] rounded-3xl border border-line bg-surface p-5 sm:px-[34px] sm:py-[30px]">
          <h2 className="m-0 text-2xl">إيه اللي هيحصل بعد ما تطلب</h2>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            {AFTER_ORDER.map((s, i) => (
              <li key={s.text} className={`rounded-[14px] p-4 ${s.info ? "bg-info-soft" : "bg-ground"}`}>
                <div className={`font-bold ${s.info ? "text-info" : "text-primary"}`}>{(i + 1).toLocaleString("ar-EG")}</div>
                <div>{s.text}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
