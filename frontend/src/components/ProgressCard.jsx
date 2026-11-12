// Purely presentational: gets numbers, shows them. All the logic
// (counting, streaks) lives in services/streak.js.
function ProgressCard({ todayCount, dailyGoal, streak, isSuccess }) {
  return (
    <div className="stat-card progress-card">
      <span>Today</span>
      <strong>
        {Math.min(todayCount, dailyGoal)}/{dailyGoal} games
      </strong>

      <p className="progress-streak">
        {streak > 0
          ? `🔥 ${streak}-day streak`
          : "No streak yet. Finish a game to start one."}
      </p>

      {isSuccess && (
        <p className="progress-success" role="status">
          Today is a success ✔
        </p>
      )}
    </div>
  );
}

export default ProgressCard;
