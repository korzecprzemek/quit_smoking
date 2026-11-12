import { useEffect, useState } from "react";
import { Anchor, Cloud, Heart, Moon, Star, Sun } from "lucide-react";
import { createDeck } from "../games/memoryDeck";

const ICONS = { sun: Sun, moon: Moon, star: Star, heart: Heart, cloud: Cloud, anchor: Anchor };
const MISMATCH_DELAY_MS = 800;
const MATCH_DELAY_MS = 350;
const NEW_ROUND_DELAY_MS = 700;

function MemoryGame() {
  const [cards, setCards] = useState(() => createDeck());
  const [flipped, setFlipped] = useState([]); // indexes of face-up, unmatched cards (max 2)
  const [rounds, setRounds] = useState(0);

  // Two cards are face up: after a short pause, keep them (match) or flip back.
  useEffect(() => {
    if (flipped.length !== 2) return;
    const [first, second] = flipped;
    const isMatch = cards[first].symbol === cards[second].symbol;

    const timerId = setTimeout(
      () => {
        if (isMatch) {
          setCards((current) =>
            current.map((card, index) =>
              index === first || index === second ? { ...card, matched: true } : card
            )
          );
        }
        setFlipped([]);
      },
      isMatch ? MATCH_DELAY_MS : MISMATCH_DELAY_MS
    );

    // If the component unmounts (or state changes) first, cancel the pending flip.
    return () => clearTimeout(timerId);
  }, [flipped, cards]);

  // Whole board matched: deal a fresh one so the minute never runs out of cards.
  useEffect(() => {
    if (!cards.every((card) => card.matched)) return;

    const timerId = setTimeout(() => {
      setCards(createDeck());
      setRounds((current) => current + 1);
    }, NEW_ROUND_DELAY_MS);

    return () => clearTimeout(timerId);
  }, [cards]);

  function flip(index) {
    const card = cards[index];
    if (card.matched || flipped.includes(index) || flipped.length >= 2) return;
    setFlipped([...flipped, index]);
  }

  return (
    <>
      <p className="muted">Find the matching pairs. Take your time.</p>

      <div className="memory-grid">
        {cards.map((card, index) => {
          const isOpen = card.matched || flipped.includes(index);
          const Icon = ICONS[card.symbol];
          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card${isOpen ? " is-open" : ""}`}
              // A hidden card must not reveal its symbol to screen readers either.
              aria-label={isOpen ? card.symbol : "Hidden card"}
              disabled={card.matched}
              onClick={() => flip(index)}
            >
              {isOpen ? <Icon size={26} aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      <p className="muted">Boards cleared: {rounds}</p>
    </>
  );
}

export default MemoryGame;
