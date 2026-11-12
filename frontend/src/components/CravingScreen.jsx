import { useState } from "react";
import GameMenu from "./GameMenu";
import GameRunner from "./GameRunner";
import { getGame } from "../games/registry";

// The craving flow, as three steps:
//   choose  -> pick something to focus on
//   playing -> a normal game (still counts toward the daily goal)
//   outcome -> "how did it go?", the only place a craving gets logged
//
// This component owns only the step; App owns the data and passes callbacks.
function CravingScreen({ onGameComplete, onLog, onCancel }) {
  const [step, setStep] = useState("choose");
  const [gameId, setGameId] = useState(null);

  if (step === "playing") {
    return (
      <GameRunner
        game={getGame(gameId)}
        onComplete={onGameComplete}
        // Finishing and quitting early both lead to the outcome question.
        onBack={() => setStep("outcome")}
        doneLabel="Continue"
      />
    );
  }

  if (step === "outcome") {
    return (
      <main className="game-screen">
        <section className="card craving-outcome">
          <h1>How did it go?</h1>
          <p className="muted">
            Be honest, this is just for you. A slip doesn't reset your quit date.
          </p>
          <button type="button" onClick={() => onLog(true)}>
            I resisted it
          </button>
          <button type="button" className="btn-secondary" onClick={() => onLog(false)}>
            I smoked
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="game-screen">
      <div className="craving-flow">
        <section className="card">
          <h1>Ride it out</h1>
          <p className="muted">
            Cravings peak and then pass. Give your mind something else to do for
            a minute.
          </p>
        </section>

        <GameMenu
          onSelect={(id) => {
            setGameId(id);
            setStep("playing");
          }}
        />

        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </main>
  );
}

export default CravingScreen;
