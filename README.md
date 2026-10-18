# استعمال طبيب

Marketplace for inspected, warrantied used dental equipment in Egypt. See `CLAUDE.md` for the product rules and design system, and `design-reference/` for the source screens.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run lint && npm run typecheck
```

| Route | Page |
|---|---|
| `/` | Home |
| `/devices` | Browse (filters also read `?state=&cat=&maint=&q=`) |
| `/devices/[id]` | Listing (inspected or inspect-on-order) |
| `/orders/[id]` | Order tracker (demo order: `/orders/1024`) |

Data is seeded in `src/lib/data.ts`. Bracketed values such as `[السعر]` are placeholders until real data exists. The sell and device-request forms open WhatsApp with the details already filled in. Set `SITE.whatsappNumber` in `src/lib/site.ts`.
