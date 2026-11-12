// Pure functions: data in, answer out. No localStorage, no "now" hidden inside.
// `today` is a parameter (defaulting to the real today) so tests can pin it.

import { toDayString } from "./progress";

export const DAILY_GOAL = 2;

// "2026-11-12" + n days -> day string. Parses the parts by hand, because
// new Date("2026-11-12") is interpreted as UTC midnight (see toDayString).
// The Date constructor handles month/year overflow (day 0 = last day of
// the previous month).
export function addDays(dayString, n) {
  const [year, month, day] = dayString.split("-").map(Number);
  return toDayString(new Date(year, month - 1, day + n));
}

export function getTodayCount(games, today = toDayString()) {
  return games.filter((game) => game.date === today).length;
}

export function isDaySuccess(count) {
  return count >= DAILY_GOAL;
}

export function getStreak(games, today = toDayString()) {
  // 1. Count games per day: { "2026-11-12": 2, ... }
  const countsByDay = {};
  for (const game of games) {
    countsByDay[game.date] = (countsByDay[game.date] ?? 0) + 1;
  }

  const isSuccess = (day) => isDaySuccess(countsByDay[day] ?? 0);

  // 2. Today is still in progress, so not having succeeded *yet* must not
  //    break the streak. Start from yesterday in that case.
  let day = isSuccess(today) ? today : addDays(today, -1);

  // 3. Walk backwards while days are successful.
  let streak = 0;
  while (isSuccess(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
}
