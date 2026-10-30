import type { DeviceType } from "@/lib/demo/types";

/** Which of the home page's illustrations (art.tsx) to use for a device type. */
export const ART: Partial<Record<DeviceType, string>> = {
  unit: "#mn-unit",
  autoclave: "#mn-autoclave",
  xray: "#mn-xray",
  endo: "#mn-endo",
  apex: "#mn-endo",
  cure: "#mn-endo",
  surg: "#mn-endo",
  rotary: "#mn-endo",
  contra: "#mn-endo",
  micro: "#mn-endo",
};

export const artFor = (t: DeviceType) => ART[t] ?? "#mn-tools";
