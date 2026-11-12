import { describe, expect, it } from "vitest";
import { toDayString, toInputDateTime } from "./progress";

describe("local date helpers", () => {
  it("formats the local day with zero padding", () => {
    expect(toDayString(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });

  it("uses local time, so late evening stays on the same day", () => {
    // toISOString() would give the next day for many timezones here.
    expect(toDayString(new Date(2026, 10, 12, 23, 30))).toBe("2026-11-12");
  });

  it("formats for datetime-local inputs", () => {
    expect(toInputDateTime(new Date(2026, 10, 12, 8, 5))).toBe("2026-11-12T08:05");
  });
});
