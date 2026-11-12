import { describe, expect, it } from "vitest";
import { countResistedThisWeek } from "./cravings";

const TODAY = "2026-11-12";
const craving = (date, resisted = true) => ({ date, at: `${date}T10:00:00Z`, resisted });

describe("countResistedThisWeek", () => {
  it("is 0 with no cravings", () => {
    expect(countResistedThisWeek([], TODAY)).toBe(0);
  });

  it("counts only resisted cravings", () => {
    const all = [craving(TODAY), craving(TODAY, false), craving("2026-11-11")];
    expect(countResistedThisWeek(all, TODAY)).toBe(2);
  });

  it("includes today and the 6 days before, not the 7th", () => {
    const all = [craving("2026-11-06"), craving("2026-11-05")];
    expect(countResistedThisWeek(all, TODAY)).toBe(1);
  });

  it("ignores future dates", () => {
    expect(countResistedThisWeek([craving("2026-11-13")], TODAY)).toBe(0);
  });

  it("works across a month boundary", () => {
    expect(countResistedThisWeek([craving("2026-10-30")], "2026-11-02")).toBe(1);
  });
});
