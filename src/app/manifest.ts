import type { MetadataRoute } from "next";

// Lets phones "Add to Home Screen" with the right name, colors and RTL.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "استعمال طبيب",
    short_name: "استعمال طبيب",
    description: "أجهزة أسنان مستعملة بفحص وضمان",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F7F4",
    theme_color: "#0D5C55",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
