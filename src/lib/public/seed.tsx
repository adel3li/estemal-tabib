"use client";

// Hands the server's public listings to the page's components until the
// browser store has loaded its own (live) list — then the store takes over.
import { createContext, useContext, useState, type ReactNode } from "react";
import { categoriesVersion, setCategories, type Category } from "@/lib/demo/labels";
import type { Device } from "@/lib/demo/types";
import { useDemo } from "@/lib/demo/store";

const Seed = createContext<Device[] | null>(null);

export function PublicSeed({ devices, categories, children }: { devices: Device[]; categories: Category[]; children: ReactNode }) {
  // Same category labels as the server used, before anything renders (no
  // hydration mismatch). Only if the browser hasn't loaded its own list yet.
  useState(() => {
    if (categories.length && categoriesVersion() === 0) setCategories(categories);
    return 0;
  });
  return <Seed.Provider value={devices.length ? devices : null}>{children}</Seed.Provider>;
}

/**
 * The listings to show: the live store once it's ready, else the server's copy.
 * `ready` is true as soon as either is there; `live` only for the store.
 */
export function usePublicDevices() {
  const { state, ready, devicesError } = useDemo();
  const seed = useContext(Seed);
  if (seed && (!ready || devicesError)) return { devices: seed, ready: true, live: false, failed: false };
  return { devices: state.devices, ready, live: ready, failed: devicesError };
}
