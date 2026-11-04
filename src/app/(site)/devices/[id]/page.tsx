import type { Metadata } from "next";
import "../../_home/v2.css";
import "./styles.css";
import { DeviceClient } from "./DeviceClient";

export const metadata: Metadata = { title: "تفاصيل الجهاز" };

export default function Page() {
  return <DeviceClient />;
}
