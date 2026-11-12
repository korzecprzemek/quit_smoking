import { GAMES } from "../games/registry";

// One button per registered game. Knows nothing about specific games.
function GameMenu({ onSelect }) {
  return (
    <section className="game-menu">
      <h2>Take a minute</h2>
      {GAMES.map((game) => (
        <button key={game.id} type="button" onClick={() => onSelect(game.id)}>
          {game.title}
          <small>{game.description}</small>
        </button>
      ))}
    </section>
  );
}

export default GameMenu;
