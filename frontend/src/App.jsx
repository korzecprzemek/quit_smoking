import { useState } from "react";
import { useEffect } from "react";
import CravingTracker from "./components/CravingTracker";
import SmokeFreeClock from "./components/SmokeFreeClock";
import StatCard from "./components/StatCard";
import LoginView from "./components/LoginView";
import BreathingGame from "./components/BreathingGame";
import './App.css';

const DEFAULT_QUIT_DATE = "2026-08-23T08:00";
const DEFAULT_CIGARETTES_PER_DAY = 15;

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

  const [quitDateInput, setQuitDateInput] = useState(
    () => localStorage.getItem("quitDate") || DEFAULT_QUIT_DATE
  );
  const quitDate = new Date(quitDateInput);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(
    () => Number(localStorage.getItem("cigarettesPerDay")) || DEFAULT_CIGARETTES_PER_DAY
  );
  const packPrice = 8;
  const cigarettesPerPack = 20;

  const smokeFreeSeconds = Math.max(
    0,
    Math.floor((now - quitDate) / 1000)
  );
  const daysSmokeFree = smokeFreeSeconds / (24 * 60 * 60);
  const cigarettesAvoided = Math.floor(daysSmokeFree * cigarettesPerDay);
  const moneySaved = (cigarettesAvoided / cigarettesPerPack) * packPrice;

  function handleCraving() {
    setCravings((current) => current + 1);
  }

  function handleQuitDateChange(event) {
    const newQuitDate = event.target.value;

    setQuitDateInput(newQuitDate);
    localStorage.setItem("quitDate", newQuitDate);
  }

  function handleCigarettesPerDayChange(event) {
    const newValue = Number(event.target.value);
    setCigarettesPerDay(newValue);

    localStorage.setItem("cigarettesPerDay", String(newValue));
  }

  if(!loggedIn){
    return <LoginView onLogin={() => setLoggedIn(true)} />;
  }
  if(currentView === "breathing") {
    return (
    <main className="breathing-screen">
      <BreathingGame onBack={ () => setCurrentView("dashboard")}/>
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