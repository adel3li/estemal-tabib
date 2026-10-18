import Link from "next/link";
import { FeaturedListings } from "@/components/FeaturedListings";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { InspectionBadge } from "@/components/InspectionBadge";
import { SellForm } from "@/components/SellForm";
import { btn } from "@/components/ui";
import { LISTINGS } from "@/lib/data";

const STEPS = [
  { title: "البايع بيعرض جهازه", body: "بيانات الجهاز، صور وفيديو وهو شغال، وسبب البيع." },
  { title: "بنفحص الجهاز", body: "أجهزة بتتفحص قبل ما تتعرض، والباقي بنفحصه عند البايع أول ما تطلبه وقبل الشحن." },
  { title: "تدفع وفلوسك محفوظة", body: "الفلوس بتفضل عندنا ومش بتتحول للبايع غير بعد ما تستلم وتجرب." },
  { title: "نوصّل لعيادتك بضمان", body: "شحن آمن لحد باب العيادة، وضمان تشغيل واستبدال وصيانة." },
];

const WARRANTY = [
  { icon: "swap", title: "استبدال أو استرجاع", body: "خلال 14 يوم لو الجهاز مطلعش زي التقرير." },
  { icon: "shield", title: "ضمان تشغيل 14 يوم", body: "جرّب الجهاز في عيادتك على حالات حقيقية واتأكد بنفسك." },
  { icon: "wrench", title: "صيانة 3 أو 6 شهور", body: "حسب نوع الجهاز، ومكتوبة بوضوح على كل جهاز." },
] as const;

const CATEGORIES = [
  { href: "/devices?cat=rotary", title: "روتاري", body: "توربينة هاي سبيد، كونترا أنجل، ستريت هاند بيس." },
  { href: "/devices?cat=camera", title: "كاميرا", body: "كاميرا إنترا أورال سلك ولاسلكي." },
  { href: "/devices?cat=light_cure", title: "لايت كيور", body: "لايت كيور LED سلك ولاسلكي." },
  { href: "/devices?cat=loupe", title: "لوب", body: "لوب تكبير بمختلف القوى، بإضاءة أو من غيرها." },
  { href: "/devices?cat=motor", title: "موتور", body: "إندو موتور، موتور جراحة وزراعة، ميكروموتور." },
]

const FAQ = [
  { q: "مين اللي بيفحص الأجهزة؟", a: "فني معتمد متخصص في أجهزة الأسنان، والتقرير بيراجعه دكتور أسنان. اسم الفاحص وتاريخ الفحص مكتوبين في كل تقرير." },
  { q: "يعني إيه \"يُفحص عند الطلب\"؟", a: "لما تطلب الجهاز، فريقنا بيروح يفحصه عند البايع. تقرير الفحص بيوصلك قبل الشحن، ولو الجهاز مش مطابق فلوسك بترجعلك كاملة." },
  { q: "ليه الصيانة 3 شهور في أجهزة و6 في أجهزة تانية؟", a: "المدة بتختلف حسب نوع الجهاز. [المعيار النهائي لتحديد المدة]" },
  { q: "المنصة بتاخد كام؟", a: "[نموذج العمولة: نسبة من البايع / المشتري / الاتنين]" },
  { q: "بتوصلوا لأنهي محافظات؟", a: "[المحافظات المتاحة في البداية]" },
];

const HERO_SUMMARY = [
  { label: "كفاءة التشغيل", value: "ممتاز" },
  { label: "السرعة والعزم", value: "سليم" },
  { label: "الحالة الظاهرية", value: "جيد جداً" },
];

const hero = LISTINGS[0];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-10 px-4 pt-8 pb-12 sm:gap-12 sm:px-5 sm:pt-16 sm:pb-14">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-[22px]">
            <span className="self-start rounded-full bg-primary-soft px-3.5 py-1.5 text-sm font-semibold text-primary">
              منصة متخصصة 100% في أجهزة الأسنان المستعملة
            </span>
            <h1 className="m-0 text-[clamp(34px,5vw,58px)] leading-tight font-bold tracking-[-0.5px]">
              من دكتور أسنان لدكتور أسنان… <span className="text-primary">بثقة</span>
            </h1>
            <p className="m-0 max-w-[560px] text-[17px] text-muted sm:text-[19px]">
              اشتري أو بيع أجهزة عيادتك المستعملة من غير قلق. كل جهاز بيتفحص بواسطة فني معتمد ودكتور أسنان، وفلوسك بتفضل
              محفوظة معانا لحد ما تستلم الجهاز وتجربه في عيادتك.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Link href="/devices" className={`${btn.primary} min-h-[52px] rounded-[14px] px-[26px] text-[17px] font-bold`}>
                اشتري جهاز
              </Link>
              <Link href="#sell" className={`${btn.accent} min-h-[52px] rounded-[14px] px-[26px] text-[17px]`}>
                بيع جهازك
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-[18px] pt-1.5 text-[15px] font-medium">
              <span className="flex items-center gap-2"><Icon name="shield" className="text-primary" />فحص فني + دكتور أسنان</span>
              <span className="flex items-center gap-2"><Icon name="lock" className="text-primary" />فلوسك محفوظة لحد الاستلام</span>
              <span className="flex items-center gap-2"><Icon name="wrench" className="text-primary" />صيانة لحد 6 شهور</span>
            </div>
          </div>

          <div className="w-full min-w-0 max-w-[520px] flex-[1_1_420px] overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_18px_40px_rgba(18,34,31,0.08)]">
            <div className="relative flex h-[230px] flex-col items-center justify-center gap-2 bg-photo text-subtle">
              <Icon name="photo" size={36} strokeWidth={1.6} />
              <span className="text-sm">صورة حقيقية للجهاز من فريق الفحص</span>
              <InspectionBadge state="inspected" className="absolute start-3.5 top-3.5" />
            </div>
            <div className="flex flex-col gap-4 px-6 py-[22px]">
              <div>
                <div className="text-xl font-bold">{hero.title} — [الماركة / الموديل]</div>
                <div className="text-sm text-muted">سنة الصنع [السنة]</div>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="text-sm font-semibold text-muted">ملخص تقرير الفحص</div>
                {HERO_SUMMARY.map((r) => (
                  <div key={r.label} className="flex items-center justify-between rounded-xl bg-ground px-3.5 py-2.5">
                    <span>{r.label}</span>
                    <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-sm font-semibold text-primary">{r.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl bg-warn-soft px-3.5 py-2.5">
                  <span>عيوب مُعلنة</span>
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-sm font-semibold text-warn">ملاحظة واحدة</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-between gap-2 border-t border-line-soft pt-3 text-[13px] text-muted">
                <span>فحص بواسطة د. [اسم الطبيب] + فني [الاسم]</span>
                <Link href={`/devices/${hero.id}#report`} className="font-semibold">
                  شوف التقرير الكامل ←
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="scroll-mt-4 border-y border-line-soft bg-surface">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-9 px-4 py-16 sm:px-5 sm:py-[72px]">
            <div className="flex flex-col gap-2">
              <h2 className="m-0 text-[28px] font-bold sm:text-[34px]">إزاي بنشتغل؟</h2>
              <p className="m-0 text-lg text-muted">أربع خطوات، وكل خطوة واضحة قدامك.</p>
            </div>
            <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] sm:gap-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-[18px] bg-ground p-5 sm:flex-col sm:gap-2.5 sm:p-[26px]">
                  <span className="flex size-11 flex-none items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
                    {(i + 1).toLocaleString("ar-EG")}
                  </span>
                  <div className="flex flex-col gap-1 sm:gap-2.5">
                    <h3 className="m-0 text-lg sm:text-xl">{s.title}</h3>
                    <p className="m-0 text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-16 sm:px-5 sm:py-[72px]">
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-[28px] font-bold sm:text-[34px]">نوعين من الفحص… وانت عارف كل جهاز فين</h2>
            <p className="m-0 text-lg text-muted">على كل جهاز علامة بتقولك اتفحص ولا لسه هيتفحص قبل ما يتشحن لك.</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-5">
            <div className="flex flex-col gap-3.5 rounded-[20px] border-2 border-primary bg-surface p-6 sm:p-[30px]">
              <InspectionBadge state="inspected" size="lg" className="self-start" />
              <h3 className="m-0 text-[22px]">الجهاز اتفحص قبل ما يتعرض</h3>
              <ul className="m-0 flex list-disc flex-col gap-1.5 ps-5 text-[#3C4C48]">
                <li>تقرير الفحص الكامل قدامك قبل ما تدفع</li>
                <li>الصور والفيديو من فريق الفحص</li>
                <li>شحن أسرع لأن الفحص خلص</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3.5 rounded-[20px] border-2 border-info bg-surface p-6 sm:p-[30px]">
              <InspectionBadge state="inspect_on_order" size="lg" className="self-start" />
              <h3 className="m-0 text-[22px]">بنفحصه عند البايع بعد طلبك وقبل الشحن</h3>
              <ul className="m-0 flex list-disc flex-col gap-1.5 ps-5 text-[#3C4C48]">
                <li>تقرير الفحص بيوصلك قبل ما الجهاز يتشحن</li>
                <li>لو الجهاز طلع مش مطابق، فلوسك بترجعلك كاملة</li>
                <li>لحد الفحص، الصور والفيديو من البايع</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="listings" className="border-y border-line-soft bg-surface">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-[26px] px-4 py-16 sm:px-5 sm:py-[72px]">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="m-0 text-[28px] font-bold sm:text-[34px]">أجهزة متاحة دلوقتي</h2>
              <Link href="/devices" className="font-semibold">
                شوف كل الأجهزة ←
              </Link>
            </div>
            <FeaturedListings listings={LISTINGS} />
          </div>
        </section>

        <section id="warranty" className="scroll-mt-4 bg-dark text-white">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-[34px] px-4 py-16 sm:px-5 sm:py-[76px]">
            <div className="flex flex-col gap-2">
              <h2 className="m-0 text-[28px] font-bold sm:text-[34px]">ضمانك مش كلمة… ضمانك مكتوب</h2>
              <p className="m-0 text-lg text-dark-muted">
                كل جهاز معاه 3 مستويات حماية، ومدة الصيانة بتختلف حسب نوع الجهاز ومكتوبة في صفحته.
              </p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
              {WARRANTY.map((w) => (
                <div key={w.title} className="flex flex-col gap-2.5 rounded-[18px] bg-dark-2 p-6 sm:p-7">
                  <Icon name={w.icon} size={30} className="text-accent" />
                  <h3 className="m-0 text-[21px]">{w.title}</h3>
                  <p className="m-0 text-dark-muted">{w.body}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 rounded-[14px] border border-dark-line px-[22px] py-[18px] text-[17px]">
              <Icon name="lock" size={24} className="flex-none text-accent" />
              <span>وطول فترة التجربة، فلوسك محفوظة عندنا ومش بتتحول للبايع غير بعد تأكيدك.</span>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-[1200px] flex-col gap-7 px-4 py-16 sm:px-5 sm:py-[72px]">
          <h2 className="m-0 text-[28px] font-bold sm:text-[34px]">كل اللي عيادتك محتاجاه</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4 sm:gap-5">
            {CATEGORIES.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="flex flex-col gap-2 rounded-[18px] border border-line bg-surface p-7 text-ink hover:border-primary hover:text-ink"
              >
                <h3 className="m-0 text-[21px]">{c.title}</h3>
                <p className="m-0 text-muted">{c.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="sell" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-5 sm:pb-[72px]">
          <div className="flex flex-wrap items-center gap-10 rounded-3xl border border-line bg-surface p-6 sm:p-10">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
              <h2 className="m-0 text-[28px] font-bold sm:text-[32px]">عندك جهاز عايز تبيعه؟</h2>
              <p className="m-0 text-lg text-muted">
                اعرض جهازك في دقايق، وإحنا نتابع الفحص والتسعير والشحن والتحصيل. من غير وسطاء ولا مشترين مش جادين.
              </p>
              <ul className="m-0 flex list-disc flex-col gap-1.5 ps-5">
                <li>سعر عادل حسب حالة الجهاز وسعر السوق</li>
                <li>المشترين دكاترة أسنان بس</li>
                <li>فلوسك بتوصلك بعد ما المشتري يستلم ويأكّد</li>
              </ul>
            </div>
            <div className="min-w-0 flex-[1_1_360px]">
              <SellForm />
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-4 border-t border-line-soft bg-surface">
          <div className="mx-auto flex max-w-[860px] flex-col gap-3.5 px-4 py-16 sm:px-5 sm:py-[72px]">
            <h2 className="m-0 mb-2.5 text-[28px] font-bold sm:text-[34px]">أسئلة شائعة</h2>
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-[14px] bg-ground px-[22px] py-[18px]">
                <summary className="text-lg font-semibold">{f.q}</summary>
                <p className="mt-2.5 mb-0 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
