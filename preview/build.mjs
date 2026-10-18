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

writeFileSync(
  `${dist}/estemal-tabib.html`,
  `<title>استعمال طبيب</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">
<style>:root{--font-plex:"IBM Plex Sans Arabic"}html,body{background:#f5f7f4}</style>
<style>${css}</style>
<div id="root" dir="rtl" lang="ar"></div>
<script>${js}</script>
`,
);
console.log("built", `${dist}/estemal-tabib.html`, Math.round((css.length + js.length) / 1024), "KB");
