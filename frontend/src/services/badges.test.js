import { describe, expect, it } from "vitest";
import { getCurrentBadge, getEarnedBadges, getNextBadge } from "./badges";

// Own list, so these tests don't break when the real thresholds are retuned.
const LIST = [
  { id: "a", minStreak: 1 },
  { id: "b", minStreak: 3 },
  { id: "c", minStreak: 7 },
];

describe("badges", () => {
  it("has none and a first target at streak 0", () => {
    expect(getEarnedBadges(0, LIST)).toEqual([]);
    expect(getCurrentBadge(0, LIST)).toBeNull();
    expect(getNextBadge(0, LIST).id).toBe("a");
  });

  it("earns a badge exactly at its threshold", () => {
    expect(getCurrentBadge(3, LIST).id).toBe("b");
    expect(getNextBadge(3, LIST).id).toBe("c");
  });

  it("stays on the highest earned badge between thresholds", () => {
    expect(getCurrentBadge(5, LIST).id).toBe("b");
    expect(getEarnedBadges(5, LIST).map((b) => b.id)).toEqual(["a", "b"]);
  });

  it("has no next badge once everything is earned", () => {
    expect(getCurrentBadge(50, LIST).id).toBe("c");
    expect(getNextBadge(50, LIST)).toBeNull();
  });
});
