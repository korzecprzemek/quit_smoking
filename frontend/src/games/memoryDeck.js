// Pure deck logic for the memory game, kept out of the component so it can
// be tested. `random` is a parameter (default Math.random) so tests can make
// the shuffle deterministic.

export const SYMBOLS = ["sun", "moon", "star", "heart", "cloud", "anchor"];

// Fisher-Yates: walk from the end, swap each item with a random earlier one.
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Every symbol twice, shuffled: [{ id, symbol, matched }, ...]
export function createDeck(symbols = SYMBOLS, random = Math.random) {
  const pairs = symbols.flatMap((symbol) => [symbol, symbol]);
  return shuffle(pairs, random).map((symbol, id) => ({
    id,
    symbol,
    matched: false,
  }));
}
