import { Check, Flame } from "lucide-react";

// Purely presentational: gets numbers, shows them. All the logic
// (counting, streaks) lives in services/streak.js.
function ProgressCard({ todayCount, dailyGoal, streak, isSuccess }) {
  const filled = Math.min(todayCount, dailyGoal);
  const remaining = dailyGoal - filled;

  return (
    <div className={`card progress-card${isSuccess ? " is-success" : ""}`}>
      <div className="progress-head">
        <span className="card-label">Today</span>
        <span className={`streak-pill${streak > 0 ? "" : " is-empty"}`}>
          <Flame size={16} aria-hidden="true" />
          {streak > 0 ? `${streak}-day streak` : "No streak yet"}
        </span>
      </div>

      <div className="goal-row">
        <div
          className="goal-dots"
          role="img"
          aria-label={`${filled} of ${dailyGoal} games completed today`}
        >
          {Array.from({ length: dailyGoal }, (_, index) => (
            <span
              key={index}
              className={`goal-dot${index < filled ? " is-filled" : ""}`}
            />
          ))}
        </div>
        <strong>
          {filled}/{dailyGoal} games
        </strong>
      </div>

      {isSuccess ? (
        <p className="progress-success" role="status">
          <Check size={18} aria-hidden="true" />
          Today is a success
        </p>
      ) : (
        <p className="muted">
          {remaining} more {remaining === 1 ? "game" : "games"} to make today count.
        </p>
      )}
    </div>
  );
}

export default ProgressCard;
