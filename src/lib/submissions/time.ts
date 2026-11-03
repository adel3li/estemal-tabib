// Deadlines for the sell-request workflow (ADMIN_SPEC §2).
import { BUSINESS } from "@/config/business";

const HOUR = 3_600_000;

/** Egypt's weekend: Friday + Saturday (DECISIONS.md). */
function isWorkingDay(t: number): boolean {
  const wd = new Date(t).toLocaleDateString("en-US", { weekday: "short", timeZone: "Africa/Cairo" });
  return wd !== "Fri" && wd !== "Sat";
}

/** `from` + n working days (same time of day). */
export function addWorkingDays(fromIso: string, n: number): number {
  let t = new Date(fromIso).getTime();
  let left = n;
  while (left > 0) {
    t += 24 * HOUR;
    if (isWorkingDay(t)) left--;
  }
  return t;
}

/** The no-reply deadline: N working days after OUR FIRST message. */
export const noReplyDeadline = (firstContactIso: string) => addWorkingDays(firstContactIso, BUSINESS.noReplyBusinessDays);

/** Hours left of the review window (negative = late). */
export const reviewHoursLeft = (createdIso: string, now: number) => Math.ceil((new Date(createdIso).getTime() + BUSINESS.sellReviewHours * HOUR - now) / HOUR);
