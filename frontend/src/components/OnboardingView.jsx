import { useState } from "react";
import { toInputDateTime } from "../services/progress";

// First-run setup. Numbers are kept as strings while typing so a field can be
// cleared and retyped; they're converted once, on submit. The browser's own
// form validation (required / min / max) blocks bad values before onSubmit runs.
function OnboardingView({ onComplete }) {
  // Fixed at mount: it's the latest allowed quit date ("not in the future").
  const [now] = useState(() => toInputDateTime(new Date()));
  const [quitDate, setQuitDate] = useState(now);
  const [cigarettesPerDay, setCigarettesPerDay] = useState("15");
  const [packPrice, setPackPrice] = useState("8");

  function handleSubmit(event) {
    event.preventDefault();
    onComplete({
      quitDate,
      cigarettesPerDay: Number(cigarettesPerDay),
      packPrice: Number(packPrice),
    });
  }

  return (
    <main className="onboarding">
      <div>
        <h1>Welcome to Puffless</h1>
        <p className="subtitle">Let's set up your quit. You can change this later.</p>
      </div>

      <form className="card onboarding-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="ob-quit-date">When did you quit?</label>
          <input
            id="ob-quit-date"
            type="datetime-local"
            required
            max={now}
            value={quitDate}
            onChange={(event) => setQuitDate(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="ob-per-day">Cigarettes you smoked per day</label>
          <input
            id="ob-per-day"
            type="number"
            inputMode="numeric"
            required
            min="1"
            step="1"
            value={cigarettesPerDay}
            onChange={(event) => setCigarettesPerDay(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="ob-pack-price">Price of a pack of 20</label>
          <input
            id="ob-pack-price"
            type="number"
            inputMode="decimal"
            required
            min="0"
            step="0.01"
            value={packPrice}
            onChange={(event) => setPackPrice(event.target.value)}
          />
        </div>

        <button type="submit" className="btn-lg">
          Start
        </button>
      </form>
    </main>
  );
}

export default OnboardingView;
