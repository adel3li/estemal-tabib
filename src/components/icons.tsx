// Stroke icons shared across pages (1.8 stroke, from the design files).
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: SVGProps<SVGSVGElement>) => ({
  "aria-hidden": true,
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const ToothIcon = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7 .5 3 1 6.5 2.5 6.5S9 18 10 15.5c.5-1.2 1.5-1.2 2 0 1 2.5 1.5 5.5 3 5.5s2-3.5 2.5-6.5c.5-2.5 2-4 2-7C19.5 5 18 3 15.5 3 13.5 3 13 4 12 4S10 3 7 3z" />
  </svg>
);

export const WhatsAppIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" />
  </svg>
);

export const ArrowLeftIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M19 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </svg>
);

export const GridIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
);

export const PlusIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, { strokeWidth: 2, ...p })}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const MailIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 7h16v12H4z" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);

export const SearchIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4.5-4.5" />
  </svg>
);

export const TruckIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);

export const LockIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export const BellIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export const HomeIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-5h4v5" />
  </svg>
);

export const ChartIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20H2" />
  </svg>
);

export const UsersIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
    <path d="M18 14a5.5 5.5 0 0 1 3.5 6" />
  </svg>
);

export const CoinsIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <ellipse cx="9" cy="7" rx="6" ry="3" />
    <path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
    <path d="M9 15v2c0 1.7 2.7 3 6 3s6-1.3 6-3v-5c0-1.7-2.7-3-6-3" />
  </svg>
);

export const GearIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);

export const CheckIcon = ({ size = 16, ...p }: P) => (
  <svg {...base(size, { strokeWidth: 2.2, ...p })}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const ExternalIcon = ({ size = 16, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);
