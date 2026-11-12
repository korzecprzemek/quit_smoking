// The list of playable games (icon: a lucide-react component for the menu). To add one: build its component (content only,
// GameShell supplies timer and navigation) and add an entry here.
//
// `id` is also what gets stored in the completed-games history, so don't
// rename an existing id without migrating old data.

import { Brain, Sparkles, Wind } from "lucide-react";
import BreathingGame from "../components/games/BreathingGame";
import BubbleGame from "../components/games/BubbleGame";
import MemoryGame from "../components/games/MemoryGame";

export const GAMES = [
  {
    id: "breathing",
    title: "Breathing",
    description: "Slow, paced breaths to calm a craving.",
    icon: Wind,
    component: BreathingGame,
  },
  {
    id: "bubbles",
    title: "Bubble pop",
    description: "Pop bubbles as they float up.",
    icon: Sparkles,
    component: BubbleGame,
  },
  {
    id: "memory",
    title: "Memory match",
    description: "Find the matching pairs.",
    icon: Brain,
    component: MemoryGame,
  },
];

export function getGame(id) {
  return GAMES.find((game) => game.id === id);
}
