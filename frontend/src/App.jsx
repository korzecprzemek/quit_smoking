import { useState } from "react";
import { useEffect } from "react";
import CravingTracker from "./components/CravingTracker";
import SmokeFreeClock from "./components/SmokeFreeClock";
import StatCard from "./components/StatCard";
import LoginView from "./components/LoginView";
import BreathingGame from "./components/BreathingGame";
import GameShell from "./components/GameShell";
import ProgressCard from "./components/ProgressCard";
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
  const [currentView, setCurrentView] = useState("dashboard");

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

  function handleQuitDateChange(event) {
    setSettings(saveSettings({ quitDate: event.target.value }));
  }

  function handleCigarettesPerDayChange(event) {
    setSettings(saveSettings({ cigarettesPerDay: Number(event.target.value) }));
  }

  if(!loggedIn){
    return <LoginView onLogin={() => setLoggedIn(true)} />;
  }
  if(currentView === "breathing") {
    return (
    <main className="breathing-screen">
      <GameShell
        title="Breathing"
        onComplete={() => setGames(completeGame("breathing"))}
        onBack={() => setCurrentView("dashboard")}
      >
        <BreathingGame />
      </GameShell>
    </main>
    )
  }

  return (
    <main className="App">
      <section className="dashboard">
        <h1>Puffless</h1>
        <p className="subtitle">One day at a time.</p>

        <label htmlFor="quit-date">When did you quit?</label>

        <input
          id="quit-date"
          type="datetime-local"
          value={quitDateInput}
          onChange={handleQuitDateChange}
        />

        <label htmlFor="cigarettes-per-day">
          Cigarettes smoked per day
        </label>

        <input
          id="cigarettes-per-day"
          type="number"
          min="0"
          value={cigarettesPerDay}
          onChange={handleCigarettesPerDayChange}
        />

        <SmokeFreeClock quitDate={quitDateInput} now={now} />

        <ProgressCard
          todayCount={todayCount}
          dailyGoal={DAILY_GOAL}
          streak={streak}
          isSuccess={isDaySuccess(todayCount)}
        />

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

        <CravingTracker
          count={cravings}
          onLogCraving={handleCraving}
        />
        <button type ="button"
        onClick={() => setCurrentView("breathing")}>
          Try breathing exercise</button>
      </section>
    </main>
  );
}

export default App;