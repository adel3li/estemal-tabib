import { AR_DIGITS, ORDER_STEPS, STEP_RELEASED, isSkipped, type Order } from "@/lib/demo/orders";

export function Stepper({ o }: { o: Order }) {
  const all = o.step >= STEP_RELEASED;
  return (
    <ol aria-label="خطوات الطلب" style={{ listStyle: "none", margin: 0, padding: "4px 0 0", display: "grid", gridTemplateColumns: "repeat(7, minmax(96px, 1fr))", gap: 0, overflowX: "auto" }}>
      {ORDER_STEPS.map((label, i) => {
        const done = i < o.step || all;
        const cur = i === o.step && o.status === "active";
        const skip = isSkipped(o, i);
        return (
          <li key={label} aria-current={cur ? "step" : undefined} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center", position: "relative", padding: "0 4px" }}>
            {i > 0 ? (
              <span aria-hidden="true" style={{ position: "absolute", top: 17, right: "50%", left: "-50%", height: 3, background: i <= o.step || all ? "#0D5C55" : "#DCE3DF" }} />
            ) : null}
            <span
              style={{
                position: "relative",
                width: 36,
                height: 36,
                borderRadius: 999,
                background: done ? "#0D5C55" : cur ? "#F2A33A" : "#FFFFFF",
                color: done ? "#FFFFFF" : "#12221F",
                border: `2px solid ${done ? "#0D5C55" : cur ? "#F2A33A" : "#C9D4CF"}`,
                boxShadow: cur ? "0 0 0 5px rgba(242,163,58,.25)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            >
              {done ? "✓" : AR_DIGITS[i]}
            </span>
            <span style={{ fontSize: 13, fontWeight: cur ? 700 : 500, color: done || cur ? "#12221F" : "#4A5A56", lineHeight: 1.4 }}>{label}</span>
            <span style={{ fontSize: 11, color: cur ? "#8A4209" : done ? "#0D5C55" : "#4A5A56" }}>
              {skip ? "مش محتاجة" : done ? "خلصت" : cur ? "دلوقتي" : "لسه"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
