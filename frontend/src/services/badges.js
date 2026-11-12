// Badge definitions are data, not JSX: to add or retune a badge, edit this
// list. The icon is a lucide-react component. Later this list could be
// swapped per addiction/program.
//
// Badges follow the current streak (days with the daily goal met), so they
// are lost if the streak resets.

import {
  Flower2,
  Leaf,
  Sprout,
  TreeDeciduous,
  Trees,
  Trophy,
} from "lucide-react";

export const BADGES = [
  { id: "first-day", minStreak: 1, label: "First day", icon: Sprout },
  { id: "three-days", minStreak: 3, label: "3 days", icon: Leaf },
  { id: "one-week", minStreak: 7, label: "One week", icon: Flower2 },
  { id: "two-weeks", minStreak: 14, label: "Two weeks", icon: TreeDeciduous },
  { id: "one-month", minStreak: 30, label: "One month", icon: Trees },
  { id: "hundred", minStreak: 100, label: "100 days", icon: Trophy },
];

// `badges` is a parameter (defaulting to the real list) so tests can pass
// their own and never break when the real thresholds change. Lists are
// assumed sorted by minStreak.
export function getEarnedBadges(streak, badges = BADGES) {
  return badges.filter((badge) => streak >= badge.minStreak);
}

export function getCurrentBadge(streak, badges = BADGES) {
  const earned = getEarnedBadges(streak, badges);
  return earned.length > 0 ? earned[earned.length - 1] : null;
}

export function getNextBadge(streak, badges = BADGES) {
  return badges.find((badge) => badge.minStreak > streak) ?? null;
}
