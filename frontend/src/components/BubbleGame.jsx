import { useEffect, useRef, useState } from "react";

const FIELD_HEIGHT = 280; // px, also used by the CSS animation distance
const SPAWN_EVERY_MS = 700;
const MAX_BUBBLES = 8;

// Called from the interval (not during render), so Math.random is fine here.
function createBubble(id) {
  const size = 36 + Math.floor(Math.random() * 30); // 36-65px
  return {
    id,
    size,
    left: Math.random() * (100 - 15), // % from the left; leaves room for width
    duration: 4 + Math.random() * 3, // seconds to float to the top
  };
}

function BubbleGame() {
  const [bubbles, setBubbles] = useState([]);
  const [popped, setPopped] = useState(0);
  const nextId = useRef(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setBubbles((current) => {
        if (current.length >= MAX_BUBBLES) return current;
        nextId.current += 1;
        return [...current, createBubble(nextId.current)];
      });
    }, SPAWN_EVERY_MS);

    return () => clearInterval(timerId);
  }, []);

  function removeBubble(id) {
    setBubbles((current) => current.filter((bubble) => bubble.id !== id));
  }

  function popBubble(id) {
    removeBubble(id);
    setPopped((count) => count + 1);
  }

  return (
    <>
      <p>Pop the bubbles as they float up. No rush, no score to beat.</p>

      <div className="bubble-field" style={{ height: FIELD_HEIGHT }}>
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            type="button"
            className="bubble"
            aria-label="Pop bubble"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.left}%`,
              bottom: -bubble.size,
              "--rise": `${FIELD_HEIGHT + bubble.size}px`,
              animationDuration: `${bubble.duration}s`,
            }}
            onClick={() => popBubble(bubble.id)}
            // Reached the top without being popped: just remove it.
            onAnimationEnd={() => removeBubble(bubble.id)}
          />
        ))}
      </div>

      <p>Popped: {popped}</p>
    </>
  );
}

export default BubbleGame;
