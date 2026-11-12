import { useEffect, useRef, useState } from "react";
import { CircleCheck } from "lucide-react";

export const GAME_DURATION_SECONDS = 5;

// Shared frame for every game: title, countdown, completion, navigation.
// A game only renders its own content as `children`.
//
// Playing for the full duration counts the game (onComplete fires once, at
// the end of the countdown). The game is NOT replaced when that happens: you
// can keep playing, and a "back" button appears beside the card.
function GameShell({
  title,
  durationSeconds = GAME_DURATION_SECONDS,
  onComplete,
  onBack,
  doneLabel = "Back to dashboard",
  children,
}) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [finished, setFinished] = useState(false);

  // Always points at the latest onComplete, so the timer effect below
  // doesn't have to depend on it (and restart whenever the parent re-renders).
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    // Measure against a fixed end time instead of counting ticks:
    // browsers throttle timers in background tabs, so tick-counting drifts.
    const endsAt = Date.now() + durationSeconds * 1000;

    const timerId = setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setSecondsLeft(left);

      if (left === 0) {
        // Stopping the interval here is what guarantees onComplete runs once.
        clearInterval(timerId);
        setFinished(true);
        onCompleteRef.current?.();
      }
    }, 250);

    return () => clearInterval(timerId);
  }, [durationSeconds]);

  return (
    <div className="game-shell-layout">
      <section className="card game-shell">
        <header className="game-shell-header">
          <h2>{title}</h2>
          <span className="game-shell-timer">
            {finished ? "Counted" : `${secondsLeft}s`}
          </span>
        </header>

        <div className="game-shell-progress" aria-hidden="true">
          <div
            style={{
              width: finished ? "100%" : `${(secondsLeft / durationSeconds) * 100}%`,
            }}
          />
        </div>

        {/* The game keeps running after the minute is up. */}
        {children}

        {/* Before the minute: leaving doesn't count. Afterwards the side panel takes over. */}
        {!finished && (
          <button type="button" className="btn-secondary" onClick={onBack}>
            Quit early
          </button>
        )}
      </section>

      {finished && (
        <div className="card game-shell-side" role="status">
          <CircleCheck size={32} aria-hidden="true" />
          <p>Counted toward today. Keep going if it helps.</p>
          <button type="button" onClick={onBack}>
            {doneLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default GameShell;
