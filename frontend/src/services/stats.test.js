import { describe, expect, it } from "vitest";
import { getCigarettesAvoided, getMoneySaved, getSmokeFreeSeconds } from "./stats";

const NOW = new Date(2026, 10, 12, 12, 0, 0); // local time, like the quit date input

describe("getSmokeFreeSeconds", () => {
  it("counts seconds since the quit date", () => {
    expect(getSmokeFreeSeconds("2026-11-12T11:00", NOW)).toBe(3600);
  });

  it("is 0 for a quit date in the future", () => {
    expect(getSmokeFreeSeconds("2026-11-13T08:00", NOW)).toBe(0);
  });

  it("is 0, not NaN, for missing or invalid dates", () => {
    expect(getSmokeFreeSeconds(null, NOW)).toBe(0);
    expect(getSmokeFreeSeconds("", NOW)).toBe(0);
    expect(getSmokeFreeSeconds("not a date", NOW)).toBe(0);
  });
});

describe("getCigarettesAvoided", () => {
  it("scales with days and rounds down", () => {
    expect(getCigarettesAvoided(2 * 86400, 15)).toBe(30);
    expect(getCigarettesAvoided(86400 / 2, 15)).toBe(7); // 7.5 -> 7
    expect(getCigarettesAvoided(0, 15)).toBe(0);
  });
});

describe("getMoneySaved", () => {
  it("is avoided cigarettes in packs times the pack price", () => {
    expect(getMoneySaved(40, 20, 8)).toBe(16);
  });

  it("is 0 when cigarettes per pack is 0 or missing", () => {
    expect(getMoneySaved(40, 0, 8)).toBe(0);
    expect(getMoneySaved(40, NaN, 8)).toBe(0);
  });
});
