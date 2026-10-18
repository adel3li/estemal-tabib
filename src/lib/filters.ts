import type { Category, InspectionState, MaintenanceMonths } from "./types";

export type BrowseFilters = {
  state: InspectionState | "all";
  cat: Category | "all";
  maint: `${MaintenanceMonths}` | "all";
  q: string;
};

export const EMPTY_FILTERS: BrowseFilters = { state: "all", cat: "all", maint: "all", q: "" };
