// The home-screen entry point to the craving flow. The log itself is
// saved by App; this card only shows the weekly count and starts the flow.
function CravingCard({ resistedThisWeek, onStart }) {
  return (
    <section className="card craving-card">
      <h2>Craving?</h2>

      <button type="button" className="btn-lg" onClick={onStart}>
        Get help now
      </button>

      <p className="muted">
        Cravings resisted this week: <strong>{resistedThisWeek}</strong>
      </p>
    </section>
  );
}

export default CravingCard;
