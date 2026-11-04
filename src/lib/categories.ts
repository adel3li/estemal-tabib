"use client";

// Device categories ⇄ Supabase (table device_categories). The list lives in
// src/lib/demo/labels.ts (updated in place); components that list categories
// use `useDeviceTypes()` so they re-render when the database list arrives.
import { useSyncExternalStore } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DEVICE_TYPES, categoriesVersion, setCategories, subscribeCategories, type Category } from "@/lib/demo/labels";

export async function fetchCategories(sb: SupabaseClient): Promise<Category[]> {
  const { data, error } = await sb.from("device_categories").select("id, label, sort, active, art, fields").order("sort");
  if (error) throw error;
  return (data ?? []) as Category[];
}

/** Load into the shared list (labels, forms, filters). */
export async function loadCategories(sb: SupabaseClient) {
  setCategories(await fetchCategories(sb));
}

/** Active categories, re-rendering when they change. */
export function useDeviceTypes() {
  useSyncExternalStore(subscribeCategories, categoriesVersion, () => 0);
  return DEVICE_TYPES;
}

/** Re-render on any category change (labels, fields). */
export function useCategoriesVersion() {
  return useSyncExternalStore(subscribeCategories, categoriesVersion, () => 0);
}
