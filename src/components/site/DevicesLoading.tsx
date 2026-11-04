// Shown while devices load from the database (or if loading failed).
export function DevicesLoading({ failed = false, cards = 4 }: { failed?: boolean; cards?: number }) {
  if (failed)
    return (
      <div role="alert" style={{ padding: "32px 20px", borderRadius: 20, background: "#FFFFFF", border: "1px dashed #E8B4B0", color: "#8C1D17", textAlign: "center", fontWeight: 600 }}>
        ما قدرناش نحمّل الأجهزة دلوقتي. حدّث الصفحة بعد شوية.
      </div>
    );
  return (
    <div className="dl-grid" role="status" aria-label="بنحمّل الأجهزة…">
      {Array.from({ length: cards }, (_, i) => (
        <div key={i} className="dl-card">
          <span className="dl-img" />
          <span className="dl-line" />
          <span className="dl-line dl-short" />
        </div>
      ))}
    </div>
  );
}
