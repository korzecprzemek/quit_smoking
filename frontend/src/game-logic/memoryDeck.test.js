import { describe, expect, it } from "vitest";
import { createDeck, shuffle } from "./memoryDeck";

describe("shuffle", () => {
  it("keeps the same items and doesn't mutate the input", () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffle(input);
    expect([...output].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it("is deterministic for a fixed random source", () => {
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual(shuffle([1, 2, 3, 4], () => 0));
  });
});

describe("createDeck", () => {
  it("has every symbol exactly twice, all unmatched, with unique ids", () => {
    const symbols = ["a", "b", "c"];
    const deck = createDeck(symbols);

    expect(deck).toHaveLength(6);
    for (const symbol of symbols) {
      expect(deck.filter((card) => card.symbol === symbol)).toHaveLength(2);
    }
    expect(deck.every((card) => card.matched === false)).toBe(true);
    expect(new Set(deck.map((card) => card.id)).size).toBe(6);
  });
});
