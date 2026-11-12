// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ProgressCard from "./ProgressCard";

afterEach(cleanup);

describe("ProgressCard", () => {
  it("shows partial progress and what is left", () => {
    render(<ProgressCard todayCount={1} dailyGoal={2} streak={0} isSuccess={false} />);
    expect(screen.getByText("1/2 games")).toBeTruthy();
    expect(screen.getByText(/1 more game to make today count/)).toBeTruthy();
    expect(screen.getByText("No streak yet")).toBeTruthy();
    expect(screen.queryByText(/today is a success/i)).toBeNull();
  });

  it("shows success and the streak when the goal is met", () => {
    render(<ProgressCard todayCount={2} dailyGoal={2} streak={3} isSuccess />);
    expect(screen.getByText("2/2 games")).toBeTruthy();
    expect(screen.getByText(/today is a success/i)).toBeTruthy();
    expect(screen.getByText("3-day streak")).toBeTruthy();
  });

  it("never shows more than the goal", () => {
    render(<ProgressCard todayCount={5} dailyGoal={2} streak={1} isSuccess />);
    expect(screen.getByText("2/2 games")).toBeTruthy();
  });
});
