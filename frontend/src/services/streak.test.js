import { describe, expect, it } from "vitest";
import { addDays, getStreak, getTodayCount, isDaySuccess } from "./streak";

const TODAY = "2026-11-12";

// Helper: n games on a given day.
const games = (date, n) =>
  Array.from({ length: n }, () => ({ type: "breathing", date }));

describe("addDays", () => {
  it("moves within a month", () => {
    expect(addDays("2026-11-12", -1)).toBe("2026-11-11");
  });

  it("crosses month and year boundaries", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
  });

  it("handles leap years", () => {
    expect(addDays("2028-03-01", -1)).toBe("2028-02-29");
  });
});

describe("getTodayCount / isDaySuccess", () => {
  it("counts only today's games", () => {
    const all = [...games(TODAY, 2), ...games("2026-11-11", 5)];
    expect(getTodayCount(all, TODAY)).toBe(2);
  });

  it("needs 2 games for a success", () => {
    expect(isDaySuccess(1)).toBe(false);
    expect(isDaySuccess(2)).toBe(true);
    expect(isDaySuccess(3)).toBe(true);
  });
});

describe("getStreak", () => {
  it("is 0 with no games", () => {
    expect(getStreak([], TODAY)).toBe(0);
  });

  it("is 1 when only today succeeded", () => {
    expect(getStreak(games(TODAY, 2), TODAY)).toBe(1);
  });

  it("does not count a day with just 1 game", () => {
    expect(getStreak(games(TODAY, 1), TODAY)).toBe(0);
  });

  it("keeps yesterday's streak while today is still in progress", () => {
    const all = [...games("2026-11-11", 2), ...games("2026-11-10", 3)];
    expect(getStreak(all, TODAY)).toBe(2);
  });

  it("adds today on top of earlier days", () => {
    const all = [
      ...games(TODAY, 2),
      ...games("2026-11-11", 2),
      ...games("2026-11-10", 2),
    ];
    expect(getStreak(all, TODAY)).toBe(3);
  });

  it("resets after a gap", () => {
    const all = [...games(TODAY, 2), ...games("2026-11-10", 2)];
    expect(getStreak(all, TODAY)).toBe(1);
  });

  it("is 0 when the last success was before yesterday", () => {
    expect(getStreak(games("2026-11-10", 2), TODAY)).toBe(0);
  });

  it("works across a month boundary", () => {
    const all = [...games("2026-11-01", 2), ...games("2026-10-31", 2)];
    expect(getStreak(all, "2026-11-01")).toBe(2);
  });
});
