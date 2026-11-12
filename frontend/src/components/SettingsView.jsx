import { useState } from "react";
import { THEMES } from "../services/theme";
import { toInputDateTime } from "../services/progress";

// Controlled inputs: values come from props, edits go up through onChange.
// This component doesn't know about storage, App decides what to do with them.
// Numbers are clamped to >= 0 here so a typo can't produce negative stats.
const toNumber = (value) => Math.max(0, Number(value) || 0);

function SettingsView({ settings, onChange, onBack }) {
  // Latest allowed quit date: "now", fixed at mount.
  const [now] = useState(() => toInputDateTime(new Date()));

  return (
    <main className="App">
      <section className="card settings-card">
        <h1>Settings</h1>

        <div className="field">
          <label htmlFor="quit-date">When did you quit?</label>
          <input
            id="quit-date"
            type="datetime-local"
            max={now}
            value={settings.quitDate ?? ""}
            onChange={(event) => onChange({ quitDate: event.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="cigarettes-per-day">Cigarettes smoked per day</label>
          <input
            id="cigarettes-per-day"
            type="number"
            min="0"
            value={settings.cigarettesPerDay}
            onChange={(event) =>
              onChange({ cigarettesPerDay: toNumber(event.target.value) })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="cigarettes-per-pack">Cigarettes per pack</label>
          <input
            id="cigarettes-per-pack"
            type="number"
            min="1"
            value={settings.cigarettesPerPack}
            onChange={(event) =>
              onChange({ cigarettesPerPack: toNumber(event.target.value) })
            }
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="pack-price">Pack price</label>
            <input
              id="pack-price"
              type="number"
              min="0"
              step="0.01"
              value={settings.packPrice}
              onChange={(event) =>
                onChange({ packPrice: toNumber(event.target.value) })
              }
            />
          </div>

          <div className="field">
            <label htmlFor="currency">Currency</label>
            <input
              id="currency"
              type="text"
              maxLength="3"
              value={settings.currency}
              onChange={(event) => onChange({ currency: event.target.value })}
            />
          </div>
        </div>

        <div className="field">
          <span id="theme-label" className="card-label">Theme</span>
          <div className="segmented" role="group" aria-labelledby="theme-label">
            {THEMES.map((theme) => (
              <button
                key={theme.value}
                type="button"
                className={settings.theme === theme.value ? "" : "btn-secondary"}
                aria-pressed={settings.theme === theme.value}
                onClick={() => onChange({ theme: theme.value })}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="btn-secondary" onClick={onBack}>
          Back to dashboard
        </button>
      </section>
    </main>
  );
}

export default SettingsView;
