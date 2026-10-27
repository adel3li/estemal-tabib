# Making a page work on every device

Working notes for the responsive pass. Read fully before starting. Also read `PORTING.md` (how pages are built) — the same file-ownership and "don't touch shared code" rules apply.

## Target

Every page must work and look intentional at **360, 390, 430 (phones), 768, 820, 1024 (tablets portrait/landscape) and 1440 (desktop)**, on iOS Safari, Android Chrome, and desktop browsers. Desktop (≥ 1024px) must keep matching the design — change small screens only, using `@media (max-width: …)` rules in the page's own `styles.css`.

Breakpoints to use: `@media (max-width: 1023px)` (tablets and below), `@media (max-width: 767px)` (phones), `@media (max-width: 380px)` (small phones) when needed.

## Already done in shared code (don't redo)

- Header: on < 1024px it's logo + «بيع جهازك» + a menu button. Sticky, height ≈ 64px. Admin: on < 1024px the sidebar is a drawer and there's a sticky dark top bar (≈ 64px); `main` gets 14px side padding and 90px bottom padding.
- All inputs/selects/textareas are forced to 16px on < 1024px (stops iOS zoom-on-focus). Don't fight it.
- `body { overflow-x: hidden }` is a safety net only — your page must not overflow on its own (the audit measures the real overflow).
- Safe areas (iPhone notch/home bar) are handled by header, admin bar and demo pill.
- The «نسخة تجريبية» pill sits at the bottom-left; leave ~60px at the bottom of long pages so it doesn't hide a final button.

## Rules for the page

1. **Inline styles win over CSS.** Most layout is inline `style={{…}}`, which a media query can't override. To make something responsive, move the property you need to change from the inline style into a class in your `styles.css` (keep the desktop value as the default, then override it in the media query). Do this only for the properties that must change; leave the rest inline.
2. **No horizontal page scroll** at any width. Wide tables/rows: either stack them into cards on phones, or wrap them in a container with `overflow-x: auto; -webkit-overflow-scrolling: touch` and a visible hint (only for genuinely tabular admin data). Chip/tab rows: allow wrap, or make them a single horizontally scrollable row with `scrollbar-width: none`.
3. **Grids/columns**: multi-column layouts → 1 column on phones, 2 on tablets where it reads well. Side panels (price card, filters, report panel, detail drawers) go **below/above** the main content on < 1024px, never squeezed beside it.
4. **Sticky asides** (`position: sticky; top: 88`) must become `position: static` on < 1024px (otherwise they slide over the content once stacked).
5. **Touch targets**: every button, link-button, chip, tab, checkbox/radio *label* ≥ 44×44px on < 1024px (padding or `min-height`), with ≥ 8px between neighbours. Inline text links inside sentences are fine as they are.
6. **Type**: headings scale down on phones (e.g. a 44px hero title → ~30px at 390; 30px page titles → ~24px). Body text ≥ 15px; nothing below 12px. Long Arabic words/numbers mustn't overflow: add `overflow-wrap: anywhere` to titles/values that can be long (device names, prices with «ج.م», codes).
7. **Images/illustrations** scale with the container (`width: 100%; height: auto`, or a set `aspect-ratio`); don't let fixed-pixel SVG widths overflow.
8. **Forms** on phones: one field per row, full-width inputs, primary button full-width at the end. Use the right keyboards: `inputMode="numeric"` for prices/numbers, `type="tel" inputMode="tel" autoComplete="tel"` for phones, `autoComplete="name"`, `type="email"` where relevant, `enterKeyHint` on last fields.
9. **Modals/drawers/panels** that open in the page: on phones show them full-width (sheet-like), scrollable inside, with a close button ≥ 44px; when one opens because the user tapped a list item, scroll it into view (`scrollIntoView({ behavior: "smooth", block: "start" })`) so the user sees it.
10. **Hover-only affordances** need a touch equivalent (nothing important may be visible only on hover).
11. `100vh` → prefer `100dvh` (with `100vh` fallback first) for full-height things.
12. Keep RTL correct (use logical properties `inset-inline-start`, `margin-inline-end`, `padding-inline` where you write new CSS).

## Tools (required)

Dev server already running: **http://127.0.0.1:3000** (hot reload). Don't start another, don't run `next build` or `npm install`.

- Audit: `cd /tmp/claude-0/pwt && node audit.mjs http://127.0.0.1:3000 /tmp/claude-0/audit-<yourname> "<route1>,<route2>" "360,390,430,768,820,1024,1440"`. It prints per route×width: real horizontal overflow (+ the elements causing it), inputs < 16px, small tap targets (first 12), tiny text, page errors; and saves full-page screenshots in that folder (`_route@width.png`). Note: the small-taps list includes inline links/labels; use judgement, but buttons/chips/tabs/nav must pass.
- Screenshot one page: `node /tmp/claude-0/pwt/snap.mjs <url> <out.png> <width> 1`.
- Look at screenshots with the Read tool (crop tall ones into ~1400px slices with Python PIL first). Check 390 and 768 visually for every page you own; check 1440 still matches `/tmp/claude-0/ref/<Design>.png`.
- For interactive bits (menus, drawers, tabs, galleries, forms), click through with a small Playwright script at 390px (`@sparticuz/chromium` + `playwright-core`, see `snap.mjs`; use `isMobile: true, hasTouch: true` and `page.tap()`).
- `npx tsc --noEmit` (report only errors in your files) and `npx eslint <your files>`.

## Done means

For every route you own, at all 7 widths: no overflow, no page errors, controls ≥ 44px, readable type, nothing overlapping, sensible stacking order, forms usable with the on-screen keyboard; desktop unchanged from the design.

Report: what you changed per page (short), anything you couldn't fix, any shared-code change you need (don't make it).
