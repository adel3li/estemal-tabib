import { BUSINESS } from "@/config/business";

const DAYS = BUSINESS.trialDays;
const [M1, M2] = BUSINESS.maintenanceMonthsOptions;

export function WarrantyAndCategories() {
  return (
    <>
    <section id="warranty" style={{ background: "#0F2A26", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", top: -180, left: -120, width: 520, height: 520, borderRadius: 999, background: "radial-gradient(circle, rgba(242, 163, 58, 0.10) 0%, rgba(242, 163, 58, 0) 70%)" }} />
      <div className="mn-sec mn-sec-80" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 34 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "32px 48px" }}>
          <div style={{ flex: "1 1 460px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ alignSelf: "flex-start", padding: "5px 12px", borderRadius: 999, background: "rgba(242, 163, 58, 0.14)", color: "#F2A33A", fontSize: 14, fontWeight: 700 }}>الضمان</span>
            <h2 className="mn-h2 mn-h2-lg" style={{ margin: 0, fontWeight: 700, lineHeight: 1.35 }}>جهازك مضمون..<br />فتشتري وأنت متطمن.</h2>
            <p className="mn-lead" style={{ margin: 0, color: "#C3D3CE", maxWidth: 560 }}>من أول ما الموقع يفحصه.. لحد المعاينة وفترة الصيانة.</p>
          </div>
          <div style={{ flex: "0 1 300px", minWidth: 0, margin: "0 auto" }}>
            <svg aria-hidden="true" viewBox="0 0 360 300" style={{ display: "block", width: "100%", maxWidth: 300, height: "auto" }}><use href="#mn-escrow" /></svg>
          </div>
        </div>
        <ol className="mn-g3 mn-g3-w" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 18 }}>
          <li style={{ padding: 26, borderRadius: 22, background: "#173A35", border: "1px solid #2E5650", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(242, 163, 58, 0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F2A33A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12a8 8 0 0 1 14-5.3L20 9" />
                  <path d="M20 4v5h-5" />
                  <path d="M20 12a8 8 0 0 1-14 5.3L4 15" />
                  <path d="M4 20v-5h5" />
                </svg>
              </span>
              <span aria-hidden="true" style={{ fontSize: 30, fontWeight: 700, color: "#F2A33A", opacity: 0.35 }}>١</span>
            </div>
            <h3 style={{ margin: 0, fontSize: 21 }}>استبدال أو استرجاع</h3>
            <p style={{ margin: 0, color: "#C3D3CE" }}>خلال {DAYS} أيام لو الجهاز مطلعش زي التقرير.</p>
          </li>
          <li style={{ padding: 26, borderRadius: 22, background: "#173A35", border: "1px solid #2E5650", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(242, 163, 58, 0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F2A33A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
              </span>
              <span aria-hidden="true" style={{ fontSize: 30, fontWeight: 700, color: "#F2A33A", opacity: 0.35 }}>٢</span>
            </div>
            <h3 style={{ margin: 0, fontSize: 21 }}>ضمان تشغيل {DAYS} أيام</h3>
            <p style={{ margin: 0, color: "#C3D3CE" }}>جرّب الجهاز في عيادتك على حالات حقيقية واتأكد بنفسك.</p>
          </li>
          <li style={{ padding: 26, borderRadius: 22, background: "#173A35", border: "1px solid #2E5650", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(242, 163, 58, 0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F2A33A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" />
                </svg>
              </span>
              <span aria-hidden="true" style={{ fontSize: 30, fontWeight: 700, color: "#F2A33A", opacity: 0.35 }}>٣</span>
            </div>
            <h3 style={{ margin: 0, fontSize: 21 }}>صيانة {M1} أو {M2} شهور</h3>
            <p style={{ margin: 0, color: "#C3D3CE" }}>حسب نوع الجهاز، ومكتوبة بوضوح على كل جهاز.</p>
          </li>
        </ol>
        <div style={{ padding: "18px 22px", borderRadius: 16, background: "rgba(13, 92, 85, 0.35)", border: "1px solid #2E5650", display: "flex", alignItems: "center", gap: 14, fontSize: 17 }}>
          <span style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: "#F2A33A", color: "#12221F", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          </span>
          <span>وطول فترة التجربة، فلوسك محفوظة عندنا ومش بتتحول للبايع غير بعد تأكيدك.</span>
        </div>
      </div>
    </section>
    </>
  );
}
