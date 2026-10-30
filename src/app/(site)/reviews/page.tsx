// `/reviews` — what dentists say about buying and selling on the site.
import type { Metadata } from "next";
import "../_home/styles.css";
import "./styles.css";
import { ReviewsBody } from "./ReviewsBody";

export const metadata: Metadata = { title: "آراء العملاء" };

export default function ReviewsPage() {
  return (
    <div className="mn-page">
      <ReviewsBody />
    </div>
  );
}
