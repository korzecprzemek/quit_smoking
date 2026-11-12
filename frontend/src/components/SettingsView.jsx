// Controlled inputs: values come from props, edits go up through onChange.
// This component doesn't know about storage, App decides what to do with them.
function SettingsView({ settings, onChange, onBack }) {
  return (
    <main className="App">
      <section className="settings-card">
        <h1>Settings</h1>

        <label htmlFor="quit-date">When did you quit?</label>
        <input
          id="quit-date"
          type="datetime-local"
          value={settings.quitDate}
          onChange={(event) => onChange({ quitDate: event.target.value })}
        />

        <label htmlFor="cigarettes-per-day">Cigarettes smoked per day</label>
        <input
          id="cigarettes-per-day"
          type="number"
          min="0"
          value={settings.cigarettesPerDay}
          onChange={(event) =>
            onChange({ cigarettesPerDay: Number(event.target.value) })
          }
        />

        <button type="button" onClick={onBack}>
          Back to dashboard
        </button>
      </section>
    </main>
  );
}

export default SettingsView;
