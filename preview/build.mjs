// Builds preview/dist/estemal-tabib.html: one self-contained page (Tailwind CSS
// and the React bundle inlined) for publishing as a Claude artifact.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { build } from "esbuild";

const dist = "preview/dist";
mkdirSync(dist, { recursive: true });

execFileSync("npx", ["@tailwindcss/cli", "-i", "src/app/globals.css", "-o", `${dist}/app.css`, "--minify"], { stdio: "inherit" });

await build({
  entryPoints: ["preview/entry.tsx"],
  bundle: true,
  minify: true,
  format: "iife",
  outfile: `${dist}/app.js`,
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  alias: {
    "next/link": "./preview/shims/link.tsx",
    "next/navigation": "./preview/shims/navigation.ts",
    "next/font/google": "./preview/shims/font.ts",
  },
  logOverride: { "unsupported-directive": "silent" },
});

const css = readFileSync(`${dist}/app.css`, "utf8");
// Keep "</script>" inside the bundle from closing the inline script tag.
const js = readFileSync(`${dist}/app.js`, "utf8").replaceAll("</script", "<\\/script");

// The site itself: a full document, published next to the frame page.
writeFileSync(
  `${dist}/site.html`,
  `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>استعمال طبيب</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">
<style>:root{--font-plex:"IBM Plex Sans Arabic"}html,body{background:#f5f7f4;margin:0}</style>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>
`,
);

// The artifact page: the site in a resizable device frame. Media queries
// follow the frame's width, so the phone sizes show the real mobile layout.
const frame = readFileSync("preview/frame.html", "utf8");
writeFileSync(`${dist}/estemal-tabib.html`, frame);
console.log("built", `${dist}/estemal-tabib.html + site.html`, Math.round((css.length + js.length) / 1024), "KB");
