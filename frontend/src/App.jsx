import { useState } from "react";
import './App.css';

function App() {
  const [cravings, setCravings] = useState(0);

  function handleCraving() {
    setCravings((current) => current +1);
  }
  
  return (
    <main className="App">
      <section className="dashboard">
        <h1>Puffless</h1>
        <p className="subtitle">One day at a time.</p>

        <div className="hero-card">
          <span>Smoke free</span>
          <strong>2 days 4 hours</strong>
        </div>
        <div className="stats">
          <div className="stat-card">
            <span>Money saved</span>
            <strong>€12.40</strong>
          </div>
          
          <div className="stat-card">
            <span>Cigarettes avoided</span>
            <strong>31</strong>
          </div>
        </div>

        <button onClick={handleCraving}>
          I'm having a craving
        </button>
        <p>Cravings logged: {cravings}</p>
      </section>
    </main>
  )
}
export default App