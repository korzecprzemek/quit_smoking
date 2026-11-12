// Pure functions over the craving log.
// Each entry: { date: "2026-11-12", at: "<ISO timestamp>", resisted: true }

import { toDayString } from "./progress";
import { addDays } from "./streak";

// Resisted cravings in the last 7 days, including today.
// "YYYY-MM-DD" strings sort the same as dates, so plain comparison works.
export function countResistedThisWeek(cravings, today = toDayString()) {
  const weekStart = addDays(today, -6);
  return cravings.filter(
    (craving) =>
      craving.resisted && craving.date >= weekStart && craving.date <= today
  ).length;
}
