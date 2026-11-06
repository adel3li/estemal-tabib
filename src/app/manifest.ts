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
    background_color: "#F3F6F7",
    theme_color: "#0A7E99",
    // Brand app icon (white mark on turquoise), from the design system.
    icons: [
      { src: "/brand/app-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
