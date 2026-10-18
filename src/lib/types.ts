export type Category = "unit" | "xray" | "sterilization" | "endo_surgery" | "instruments";

export type InspectionState = "inspected" | "inspect_on_order";

export type MaintenanceMonths = 3 | 6;

export type CheckResult = "pass" | "note" | "fail";

export type Seller = {
  id: string;
  name: string;
  verifiedDentist: boolean;
  whatsapp: string | null;
};

export type ChecklistItem = {
  label: string;
  result: CheckResult;
  note?: string;
  photo?: string;
};

export type DisclosedDefect = {
  description: string;
  photo?: string;
};

export type InspectionReport = {
  id: string;
  listingId: string;
  serialNumber: string | null;
  date: string | null;
  technicianName: string | null;
  reviewingDentistName: string | null;
  operationScore: string;
  appearanceScore: string;
  replacedParts: string[];
  checklistItems: ChecklistItem[];
  disclosedDefects: DisclosedDefect[];
  /** Key results shown as chips in summaries, e.g. Bowie-Dick for autoclaves. */
  highlights?: { label: string; value: string }[];
};

export type Listing = {
  id: string;
  title: string;
  category: Category;
  brand: string | null;
  model: string | null;
  year: number | null;
  originCountry: string | null;
  governorate: string;
  /** null until real prices are set; rendered as the [السعر] placeholder. */
  priceEgp: number | null;
  fairPriceBand: { min: number; max: number } | null;
  inspectionState: InspectionState;
  maintenanceMonths: MaintenanceMonths;
  sellerId: string;
  sellReason: string | null;
  photos: string[];
  videos: string[];
  status: "active" | "reserved" | "sold";
  listedAt: string;
};

export type OrderStatus =
  | "paid_in_escrow"
  | "inspection_at_seller"
  | "report_sent_awaiting_buyer"
  | "shipping"
  | "delivered"
  | "trial_period"
  | "released_to_seller"
  | "cancelled_refunded"
  | "returned"
  | "replaced";

export type Order = {
  id: string;
  listingId: string;
  buyerId: string;
  amountEgp: number | null;
  status: OrderStatus;
  timestamps: Partial<Record<OrderStatus, string>>;
  warrantyStartDate: string | null;
};

export type DeviceRequest = {
  deviceType: string;
  budget: string;
  contact: string;
};
