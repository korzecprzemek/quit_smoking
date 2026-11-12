import { GAMES } from "../../game-logic/registry";

// One tile per registered game. Knows nothing about specific games.
function GameMenu({ onSelect }) {
  return (
    <section className="card game-menu">
      <h2>Take a minute</h2>
      {GAMES.map((game) => {
        const Icon = game.icon;
        return (
          <button
            key={game.id}
            type="button"
            className="game-tile"
            onClick={() => onSelect(game.id)}
          >
            <span className="game-tile-icon">
              <Icon size={22} aria-hidden="true" />
            </span>
            <span className="game-tile-text">
              <strong>{game.title}</strong>
              <small>{game.description}</small>
            </span>
          </button>
        );
      })}
    </section>
  );
}

export default GameMenu;
