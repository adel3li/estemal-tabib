# Porting a design screen to a Next.js page

Working notes for turning `design-reference/<Name>.dc.html` into a real page in the clickable demo. Read this whole file before starting.

## Goal

The page must **look the same as the design** (compare screenshots) and **work**: every link goes to a real route, every button does something, forms validate and save to the shared demo store, and admin changes show up on the public site.

## The design file format

- `<helmet><style>…</style></helmet>` holds page CSS (classes have a page prefix such as `mn-`, `br-`, `al-`). Copy the rules into `styles.css` next to your page and `import "./styles.css"` from the page. Keep the class names. Skip `body{}` and the base `a{}` rules (already global). Skip the Google Fonts `<link>` (the font is global). The admin `ad-*` classes and the site header/footer are already global: don't copy them again.
- The markup uses **inline `style="…"` everywhere**. Port it as React `style={{ … }}` objects with the same values (camelCase keys, numbers for px). Matching the inline styles is how the page will match the design.
- `sc-camel-view-box="0 0 24 24"` → `viewBox="0 0 24 24"` (same for other `sc-camel-*` attributes → camelCase: `preserveAspectRatio`). `sc-camel-on-click="{{x}}"` → `onClick={x}`, `sc-camel-on-change` → `onChange`.
- `<sc-for each="{{items}}" as="c">` → `items.map((c) => …)` (add a `key`). `<sc-if value="{{x}}">` → `{x ? … : null}`. `<sc-raw-select>` → a normal `<select>`.
- `{{name}}` values come from the `<script type="text/x-dc">` class at the bottom: its `state` becomes `useState`, `renderVals()` becomes plain derived values in the component. Port the logic, but **read data from the demo store** instead of the hard-coded arrays wherever the store has it (see below).
- SVG: each page has an `<svg width=0 height=0>` block of `<symbol>`s used via `<use href="#id">`. Port the symbols you need into an `art.tsx` file next to your page (render the hidden `<svg><defs/>…<symbol/></svg>` block once in the page). Keep ids page-prefixed, as in the design, so pages don't collide.
- Header/footer: **don't port them.** `src/app/(site)/layout.tsx` already renders `SiteHeader`/`SiteFooter`; `src/app/admin/layout.tsx` renders the sidebar (`AdminShell`). Port only what's between header and footer (public) or inside `<main>` (admin).
- Copy Arabic text **exactly**. Keep `[placeholders]` as they are.

## Shared code you must use

- `useDemo()` from `@/lib/demo/store` (client components only; add `"use client"`). It gives `state.devices / submissions / requests / inspections / favorites` and actions: `addDevice`, `updateDevice`, `addSubmission`, `updateSubmission`, `acceptSubmission`, `addRequest`, `updateRequest`, `updateInspection`, `approveInspection`, `toggleFavorite`, `matchesFor`, `getDevice`, plus `ready` (false on the first render, before localStorage is read). Types in `@/lib/demo/types`, seed in `@/lib/demo/seed`.
- `isListed(d)` (published → shown in «كل الأجهزة») and `isPublic(d)` (published / reserved / sold → device page reachable) from the store.
- Labels/helpers: `@/lib/demo/labels` → `DEVICE_TYPES`, `typeLabel`, `CONDITIONS`, `INSPECTION_LABEL`, `STATUS_LABEL`, `GOVERNORATES`, `fmt` (120000 → «120,000»), `parseNum` (accepts Arabic-Indic digits).
- Business numbers: `BUSINESS`, `sellerNetFromSalePrice`, `salePriceFromSellerNet` from `@/config/business`. Never hard-code 300 / 500 / 0.85 / 3 days.
- Links: **always** use `routes` from `@/lib/routes` with `next/link` `<Link>`. Map design links: `Main.dc.html` → `routes.home`, `Browse.dc.html` → `routes.devices`, `Listing-*.dc.html` → `routes.device(id)`, `Sell` → `routes.sell`, `Request` → `routes.request`, `Terms` → `routes.terms`, `About` → `routes.about`, `Order-Tracker` → `routes.order(id)` / `routes.demoOrder`, `Admin.dc.html` → `routes.admin.newDevice`, other admin pages → `routes.admin.*`. `#how/#warranty/#faq` on the home page are section ids. No `href="#"` left behind: if a design link has nowhere real to go, make it a WhatsApp link (`waLink(message)` from `@/lib/whatsapp`, opens in a new tab) or remove the href and say so in your report.
- Icons: `@/components/icons` has the common ones; otherwise inline the design's SVG.
- Dynamic routes: `params` is a Promise in Next 16 — in a client page use `useParams()` from `next/navigation`; in a server page `const { id } = await params`.

## Rules

- TypeScript strict, no `any`. Small files: split big pages into a few components in the route folder (e.g. `_components/` or plain sibling files).
- A page that only reads the store must handle `ready === false` gracefully (render the seed data — it's already in `state` — don't flash an empty state).
- Show a short toast/inline confirmation after admin actions, like the design does.
- Don't touch files you don't own. If you need a change in shared code (`src/lib/**`, `src/components/**`, layouts, `globals.css`), **don't edit it** — describe the change in your report and work around it locally.
- Don't run `next build`, `npm install`, or start another dev server. A dev server is already running at **http://127.0.0.1:3000** with hot reload.
- Check your work: `npx tsc --noEmit` (whole project, report only errors in your files) and `npx eslint <your files>`.

## Visual check (required)

- Reference screenshots of the design: `/tmp/claude-0/ref/<Name>.png` (1440px wide, full page; the design file names).
- Screenshot your page: `node /tmp/claude-0/pwt/snap.mjs http://127.0.0.1:3000/<route> /tmp/claude-0/out/<name>.png 1440 1` (also try `390` for mobile). The script prints page errors — fix them.
- Look at both images (crop tall ones with Python PIL into ~1400px-tall slices and view them with the Read tool) and fix differences in layout, spacing, colors and text until they match. Small differences in the illustrations are fine; missing sections are not.
