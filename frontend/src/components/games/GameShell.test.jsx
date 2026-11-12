// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GameShell from "./GameShell";

// Fake timers also fake Date, so the shell's "ends at" clock follows them.
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function renderShell(props = {}, { strict = false } = {}) {
  const onComplete = vi.fn();
  const onBack = vi.fn();
  const ui = (
    <GameShell
      title="Test game"
      durationSeconds={5}
      onComplete={onComplete}
      onBack={onBack}
      {...props}
    >
      <p>game content</p>
    </GameShell>
  );
  const view = render(strict ? <StrictMode>{ui}</StrictMode> : ui);
  return { ...view, onComplete, onBack };
}

describe("GameShell", () => {
  it("renders the game and counts down", () => {
    renderShell();
    expect(screen.getByText("game content")).toBeTruthy();
    expect(screen.getByText("5s")).toBeTruthy();

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText("3s")).toBeTruthy();
  });

  it("calls onComplete exactly once when time is up, even under StrictMode", () => {
    const { onComplete } = renderShell({}, { strict: true });

    act(() => vi.advanceTimersByTime(4000));
    expect(onComplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(2000));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/counted toward today/i)).toBeTruthy();
  });

  it("keeps the game on screen after the minute is up", () => {
    renderShell();
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByText("game content")).toBeTruthy();
  });

  it("keeps counting only once however long you keep playing", () => {
    const { onComplete } = renderShell();
    act(() => vi.advanceTimersByTime(60_000));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("offers the back button beside the game only after the minute", () => {
    const { onBack } = renderShell({ doneLabel: "Continue" });
    expect(screen.queryByRole("button", { name: "Continue" })).toBeNull();

    act(() => vi.advanceTimersByTime(6000));
    // "Quit early" is replaced by the side button once the game counted.
    expect(screen.queryByRole("button", { name: /quit early/i })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("does not count the game when the player quits early", () => {
    const { onComplete, onBack, unmount } = renderShell();

    fireEvent.click(screen.getByRole("button", { name: /quit early/i }));
    expect(onBack).toHaveBeenCalledTimes(1);

    unmount(); // what navigating away does
    act(() => vi.advanceTimersByTime(10_000));
    expect(onComplete).not.toHaveBeenCalled();
  });
});
