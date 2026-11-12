import GameShell from "./GameShell";

// Full-screen "play one game" view, shared by the dashboard and the craving
// flow so the shell wiring lives in one place.
function GameRunner({ game, onComplete, onBack, doneLabel }) {
  const Game = game.component;

  return (
    <main className="game-screen">
      <GameShell
        title={game.title}
        onComplete={() => onComplete(game.id)}
        onBack={onBack}
        doneLabel={doneLabel}
      >
        <Game />
      </GameShell>
    </main>
  );
}

export default GameRunner;
