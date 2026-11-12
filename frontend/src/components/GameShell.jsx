import { useEffect, useRef, useState } from "react";

export const GAME_DURATION_SECONDS = 60;

// Shared frame for every game: title, countdown, back button, completion.
// A game only renders its own content as `children`.
function GameShell({
  title,
  durationSeconds = GAME_DURATION_SECONDS,
  onComplete,
  onBack,
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
        clearInterval(timerId);
        setFinished(true);
        onCompleteRef.current?.();
      }
    }, 250);

    return () => clearInterval(timerId);
  }, [durationSeconds]);

  return (
    <section className="game-shell">
      <header className="game-shell-header">
        <h2>{title}</h2>
        <span className="game-shell-timer">
          {finished ? "Done" : `${secondsLeft}s`}
        </span>
      </header>

      {finished ? (
        <div className="game-shell-done" role="status">
          <p>Well done. That one counts toward today.</p>
          <button type="button" onClick={onBack}>
            Back to dashboard
          </button>
        </div>
      ) : (
        <>
          {children}
          <button type="button" onClick={onBack}>
            Quit early
          </button>
        </>
      )}
    </section>
  );
}

export default GameShell;
