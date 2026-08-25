import { useState } from "react";
import { useEffect } from "react";
import CravingTracker from "./components/CravingTracker";
import './App.css';

const DEFAULT_QUIT_DATE = "2026-08-23T08:00";
const DEFAULT_CIGARETTES_PER_DAY = 15;

function App() {
  const [cravings, setCravings] = useState(0);
  const [now, setNow] = useState(() => new Date());

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
    () => localStorage.getItem("cigarettesPerDay") || DEFAULT_CIGARETTES_PER_DAY
  );
  const packPrice = 8;
  const cigarettesPerPack = 20;

  const smokeFreeMilliseconds = now - quitDate;
  const smokeFreeSeconds = Math.max(
    0,
    Math.floor(smokeFreeMilliseconds / 1000)
  );

  const daysSmokeFree = smokeFreeSeconds / (24 * 60 * 60);

  const days = Math.floor(smokeFreeSeconds / (24 * 60 * 60));

  const hours = Math.floor(
    (smokeFreeSeconds % (24 * 60 * 60)) / (60 * 60)
  );

  const minutes = Math.floor(
    (smokeFreeSeconds % (60 * 60)) / 60
  );

  const seconds = smokeFreeSeconds % 60;
  
  const cigarettesAvoided = Math.floor(
    daysSmokeFree * cigarettesPerDay
  )

  function padTime(value) {
    return String(value).padStart(2,"0");
  }
  function handleCraving() {
    setCravings((current) => current +1);
  };

  function handleQuitDateChange(event) {
    const newQuitDate = event.target.value;

    setQuitDateInput(newQuitDate);
    localStorage.setItem("quitDate", newQuitDate);
  }

  function handleCigarettesPerDayChange(event) {
    const newValue = Number(event.target.value);
    setCigarettesPerDay(newValue);

    localStorage.setItem("cigarettesPerDay", newValue);
  }

  const moneySaved = (cigarettesAvoided / cigarettesPerPack) * packPrice

  
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
        <div className="hero-card">
          <span>Smoke free</span>
          <strong className="timer">
            <span>{days} days</span>
            {padTime(hours)}:
            {padTime(minutes)}:
            {padTime(seconds)}
          </strong>
        </div>
        <div className="stats">
          <div className="stat-card">
            <span>Money saved</span>
            <strong>€{moneySaved.toFixed(2)}</strong>
          </div>
          
          <div className="stat-card">
            <span>Cigarettes avoided</span>
            <strong>{cigarettesAvoided}</strong>
          </div>
        </div>
        
        <CravingTracker
          count={cravings}
          onLogCraving={handleCraving}
        />
      </section>
    </main>
  )
}
export default App