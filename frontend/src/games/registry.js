// The list of playable games. To add one: build its component (content only,
// GameShell supplies timer and navigation) and add an entry here.
//
// `id` is also what gets stored in the completed-games history, so don't
// rename an existing id without migrating old data.

import BreathingGame from "../components/BreathingGame";

export const GAMES = [
  {
    id: "breathing",
    title: "Breathing",
    description: "Slow, paced breaths to calm a craving.",
    component: BreathingGame,
  },
];

export function getGame(id) {
  return GAMES.find((game) => game.id === id);
}
