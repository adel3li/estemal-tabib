// Every route in the demo. Pages link through these helpers so a rename
// only touches this file.

export const routes = {
  home: "/",
  how: "/how",
  warranty: "/warranty",
  faq: "/faq",
  reviews: "/reviews",
  devices: "/devices",
  device: (id: string) => `/devices/${encodeURIComponent(id)}`,
  sell: "/sell",
  request: "/request",
  terms: "/terms",
  termsBuyer: "/terms?tab=buyer",
  about: "/about",
  order: (id: string) => `/orders/${encodeURIComponent(id.replace(/^#/, ""))}`,
  /** Demo order the header «تابع طلبك» opens (inspect-on-order, step 3/7). */
  demoOrder: "/orders/2043",
  admin: {
    root: "/admin",
    devices: "/admin/devices",
    newDevice: "/admin/devices/new",
    editDevice: (id: string) => `/admin/devices/${encodeURIComponent(id)}/edit`,
    submissions: "/admin/submissions",
    inspections: "/admin/inspections",
    orders: "/admin/orders",
    payments: "/admin/payments",
    requests: "/admin/requests",
  },
} as const;
