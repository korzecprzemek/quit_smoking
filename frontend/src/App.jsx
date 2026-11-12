import { useState } from "react";
import { useEffect } from "react";
import CravingTracker from "./components/CravingTracker";
import SmokeFreeClock from "./components/SmokeFreeClock";
import StatCard from "./components/StatCard";
import LoginView from "./components/LoginView";
import GameMenu from "./components/GameMenu";
import GameShell from "./components/GameShell";
import SettingsView from "./components/SettingsView";
import ProgressCard from "./components/ProgressCard";
import { getGame } from "./games/registry";
import {
  completeGame,
  getCompletedGames,
  getSettings,
  saveSettings,
  toDayString,
} from "./services/progress";
import {
  DAILY_GOAL,
  getStreak,
  getTodayCount,
  isDaySuccess,
} from "./services/streak";
import './App.css';

function App() {
  const [cravings, setCravings] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeGameId, setActiveGameId] = useState(null); // null = dashboard
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, 1_000);

    return () => clearInterval(timerId);
  }, []);

  const [games, setGames] = useState(getCompletedGames);
  const [settings, setSettings] = useState(getSettings);
  const quitDateInput = settings.quitDate;
  const cigarettesPerDay = settings.cigarettesPerDay;
  const quitDate = new Date(quitDateInput);
  const packPrice = 8;
  const cigarettesPerPack = 20;

  const smokeFreeSeconds = Math.max(
    0,
    Math.floor((now - quitDate) / 1000)
  );
  const daysSmokeFree = smokeFreeSeconds / (24 * 60 * 60);
  const cigarettesAvoided = Math.floor(daysSmokeFree * cigarettesPerDay);
  const moneySaved = (cigarettesAvoided / cigarettesPerPack) * packPrice;

  // Derived on every render from `games`: no separate state to keep in sync.
  // Using `now` (ticks every second) means the day rolls over by itself.
  const today = toDayString(now);
  const todayCount = getTodayCount(games, today);
  const streak = getStreak(games, today);

  function handleCraving() {
    setCravings((current) => current + 1);
  }

  function handleSettingsChange(changes) {
    setSettings(saveSettings(changes));
  }

  if(!loggedIn){
    return <LoginView onLogin={() => setLoggedIn(true)} />;
  }
  const activeGame = getGame(activeGameId);
  if (activeGame) {
    const Game = activeGame.component;
    return (
      <main className="game-screen">
        <GameShell
          title={activeGame.title}
          onComplete={() => setGames(completeGame(activeGame.id))}
          onBack={() => setActiveGameId(null)}
        >
          <Game />
        </GameShell>
      </main>
    );
  }

  if (showSettings) {
    return (
      <SettingsView
        settings={settings}
        onChange={handleSettingsChange}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <main className="App">
      <div className="dashboard">
        <header className="dashboard-header">
          <div>
            <h1>Puffless</h1>
            <p className="subtitle">One day at a time.</p>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Settings"
            onClick={() => setShowSettings(true)}
          >
            ⚙︎
          </button>
        </header>

        <div className="dashboard-grid">
          <div className="pane pane-left">
            <ProgressCard
              todayCount={todayCount}
              dailyGoal={DAILY_GOAL}
              streak={streak}
              isSuccess={isDaySuccess(todayCount)}
            />
            <CravingTracker count={cravings} onLogCraving={handleCraving} />
          </div>

          <div className="pane pane-main">
            <SmokeFreeClock quitDate={quitDateInput} now={now} />
            <div className="stats">
              <StatCard
                label="Money saved"
                value={`€${moneySaved.toFixed(2)}`}
              />
              <StatCard
                label="Cigarettes avoided"
                value={String(cigarettesAvoided)}
              />
            </div>
          </div>

          <div className="pane pane-games">
            <GameMenu onSelect={setActiveGameId} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;