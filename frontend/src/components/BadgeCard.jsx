import { Lock } from "lucide-react";
import {
  BADGES,
  getCurrentBadge,
  getNextBadge,
} from "../services/badges";

// Presentational: takes the streak, shows the earned badge, the next
// target, and the whole collection. The list itself is data (services/badges).
function BadgeCard({ streak }) {
  const current = getCurrentBadge(streak);
  const next = getNextBadge(streak);
  const daysToNext = next ? next.minStreak - streak : 0;
  const CurrentIcon = current?.icon;

  return (
    <section className="card badge-card">
      <h2>Badges</h2>

      <div className="badge-current">
        <span className={`badge-icon badge-icon-lg${current ? " is-earned" : ""}`}>
          {current ? (
            <CurrentIcon size={32} aria-hidden="true" />
          ) : (
            <Lock size={28} aria-hidden="true" />
          )}
        </span>
        <div>
          <strong>{current ? current.label : "No badge yet"}</strong>
          <p className="muted">
            {next
              ? `Next: ${next.label}, ${daysToNext} more ${daysToNext === 1 ? "day" : "days"}`
              : "You've earned every badge."}
          </p>
        </div>
      </div>

      <ul className="badge-row">
        {BADGES.map((badge) => {
          const Icon = badge.icon;
          const earned = streak >= badge.minStreak;
          return (
            <li key={badge.id}>
              <span
                className={`badge-icon${earned ? " is-earned" : ""}`}
                title={`${badge.label} (${badge.minStreak}-day streak)`}
                role="img"
                aria-label={`${badge.label}, ${earned ? "earned" : "locked"}`}
              >
                <Icon size={20} aria-hidden="true" />
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default BadgeCard;
