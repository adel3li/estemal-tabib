import { typeLabel } from "@/lib/demo/labels";
import type { Device, DeviceRequest } from "@/lib/demo/types";
import { RqIcon } from "./art";
import { ST, budgetTxt, prefOf } from "./model";

type Props = {
  reqs: DeviceRequest[];
  sel: string;
  query: string;
  matchesFor: (r: DeviceRequest) => Device[];
  onPick: (id: string) => void;
};

export function RequestList({ reqs, sel, query, matchesFor, onPick }: Props) {
  return (
    <section aria-label="قائمة الطلبات" style={{ flex: "999 1 460px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {reqs.map((r) => {
        const n = matchesFor(r).length;
        const on = sel === r.id;
        const [stTxt, stBg, stFg] = ST[r.status];
        const [pref, prefBg, prefFg] = prefOf(r);
        return (
          <button
            key={r.id}
            id={`rq-item-${r.id}`}
            type="button"
            className="rq-item"
            onClick={() => onPick(r.id)}
            aria-pressed={on}
            style={{ border: `2px solid ${on ? "#0D5C55" : "#DCE3DF"}`, background: on ? "#F7FBFA" : "#FFFFFF" }}
          >
            <RqIcon type={r.deviceType} />
            <span className="rq-body" style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 17 }}>{typeLabel(r.deviceType)}</span>
                <span className="rq-pill" style={{ background: stBg, color: stFg }}><span className="rq-dot" />{stTxt}</span>
              </span>
              <span className="rq-sub">{r.fullName} · {r.governorate} · {r.createdAt}</span>
              <span style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 13 }}>
                <span className="rq-pill" style={{ background: "#F5F7F4", color: "#3C4C48", border: "1px solid #DCE3DF", fontWeight: 600 }}>
                  الميزانية: {budgetTxt(r)} ج.م
                </span>
                <span className="rq-pill" style={{ background: prefBg, color: prefFg, fontWeight: 600 }}>{pref}</span>
              </span>
            </span>
            <span
              className="rq-count"
              style={{
                padding: "8px 10px",
                borderRadius: 14,
                background: n ? "#EAF5DD" : "#F5F7F4",
                color: n ? "#3F7A1F" : "#4A5A56",
                alignItems: "center",
                lineHeight: 1.3,
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 700 }}>{n}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>أجهزة مطابقة</span>
            </span>
          </button>
        );
      })}
      {reqs.length === 0 ? (
        <div className="ad-card" style={{ alignItems: "center", textAlign: "center", color: "#4A5A56", padding: "40px 20px" }}>
          مفيش طلبات هنا{query ? " بالبحث ده" : ""}.
        </div>
      ) : null}
    </section>
  );
}
