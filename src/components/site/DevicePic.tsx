// A listing's cover: the real photo when it has one, otherwise the drawing.
const fill = { display: "block", width: "100%", height: "100%" } as const;

export function DevicePic({ src, art, label }: { src?: string; art: string; label: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- Storage URLs, already resized on upload
    return <img src={src} alt={label} loading="lazy" decoding="async" style={{ ...fill, objectFit: "cover" }} />;
  }
  return (
    <svg role="img" aria-label={label} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={fill}>
      <use href={art} />
    </svg>
  );
}
