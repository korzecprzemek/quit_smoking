import { useState } from "react";
import { useEffect } from "react";
import BadgeCard from "./components/BadgeCard";
import CravingCard from "./components/CravingCard";
import CravingScreen from "./components/CravingScreen";
import SmokeFreeClock from "./components/SmokeFreeClock";
import StatCard from "./components/StatCard";
import LoginView from "./components/LoginView";
import GameMenu from "./components/GameMenu";
import GameRunner from "./components/GameRunner";
import SettingsView from "./components/SettingsView";
import ProgressCard from "./components/ProgressCard";
import { Settings } from "lucide-react";
import { getGame } from "./games/registry";
import {
  completeGame,
  getCompletedGames,
  getCravings,
  getSettings,
  logCraving,
  saveSettings,
  toDayString,
} from "./services/progress";
import { countResistedThisWeek } from "./services/cravings";
import {
  DAILY_GOAL,
  getStreak,
  getTodayCount,
  isDaySuccess,
} from "./services/streak";

function App() {
  const [now, setNow] = useState(() => new Date());
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeGameId, setActiveGameId] = useState(null); // null = dashboard
  const [showSettings, setShowSettings] = useState(false);
  const [showCraving, setShowCraving] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, 1_000);

    return () => clearInterval(timerId);
  }, []);

  const [games, setGames] = useState(getCompletedGames);
  const [cravings, setCravings] = useState(getCravings);
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
  const resistedThisWeek = countResistedThisWeek(cravings, today);

  function handleGameComplete(gameId) {
    setGames(completeGame(gameId));
  }

  function handleCravingLogged(resisted) {
    setCravings(logCraving(resisted));
    setShowCraving(false);
  }

  function handleSettingsChange(changes) {
    setSettings(saveSettings(changes));
  }

  if(!loggedIn){
    return <LoginView onLogin={() => setLoggedIn(true)} />;
  }
  const activeGame = getGame(activeGameId);
  if (activeGame) {
    return (
      <GameRunner
        game={activeGame}
        onComplete={handleGameComplete}
        onBack={() => setActiveGameId(null)}
      />
    );
  }

  if (showCraving) {
    return (
      <CravingScreen
        onGameComplete={handleGameComplete}
        onLog={handleCravingLogged}
        onCancel={() => setShowCraving(false)}
      />
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
            <Settings size={22} aria-hidden="true" />
          </button>
        </header>

        <div className="dashboard-grid">
          <div className="pane pane-left">
            <CravingCard
              resistedThisWeek={resistedThisWeek}
              onStart={() => setShowCraving(true)}
            />
            <ProgressCard
              todayCount={todayCount}
              dailyGoal={DAILY_GOAL}
              streak={streak}
              isSuccess={isDaySuccess(todayCount)}
            />
            <BadgeCard streak={streak} />
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