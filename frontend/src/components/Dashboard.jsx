import { Settings } from "lucide-react";
import { useNavigate } from "react-router";
import BadgeCard from "./BadgeCard";
import CravingCard from "./CravingCard";
import GameMenu from "./GameMenu";
import ProgressCard from "./ProgressCard";
import SmokeFreeClock from "./SmokeFreeClock";
import StatCard from "./StatCard";
import { countResistedThisWeek } from "../services/cravings";
import { toDayString } from "../services/progress";
import {
  getCigarettesAvoided,
  getMoneySaved,
  getSmokeFreeSeconds,
} from "../services/stats";
import {
  DAILY_GOAL,
  getStreak,
  getTodayCount,
  isDaySuccess,
} from "../services/streak";

// The home screen. It receives the raw data (settings, games, cravings, now)
// and derives every number from it during render, so nothing can go stale.
function Dashboard({ now, settings, games, cravings }) {
  const navigate = useNavigate();

  const today = toDayString(now);
  const todayCount = getTodayCount(games, today);
  const streak = getStreak(games, today);
  const resistedThisWeek = countResistedThisWeek(cravings, today);

  const smokeFreeSeconds = getSmokeFreeSeconds(settings.quitDate, now);
  const cigarettesAvoided = getCigarettesAvoided(
    smokeFreeSeconds,
    settings.cigarettesPerDay
  );
  const moneySaved = getMoneySaved(
    cigarettesAvoided,
    settings.cigarettesPerPack,
    settings.packPrice
  );

  return (
    <main className="App">
      <div className="dashboard">
        <header className="dashboard-header">
          <div>
            <h1>Puffless</h1>
            <p className="subtitle">One day at a time.</p>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Settings"
            onClick={() => navigate("/settings")}
          >
            <Settings size={22} aria-hidden="true" />
          </button>
        </header>

        <div className="dashboard-grid">
          <div className="pane pane-left">
            <CravingCard
              resistedThisWeek={resistedThisWeek}
              onStart={() => navigate("/craving")}
            />
            <ProgressCard
              todayCount={todayCount}
              dailyGoal={DAILY_GOAL}
              streak={streak}
              isSuccess={isDaySuccess(todayCount)}
            />
            <BadgeCard streak={streak} />
          </div>

          <div className="pane pane-main">
            <SmokeFreeClock quitDate={settings.quitDate} now={now} />
            <div className="stats">
              <StatCard
                label="Money saved"
                value={`${settings.currency}${moneySaved.toFixed(2)}`}
              />
              <StatCard
                label="Cigarettes avoided"
                value={String(cigarettesAvoided)}
              />
            </div>
          </div>

          <div className="pane pane-games">
            <GameMenu onSelect={(gameId) => navigate(`/games/${gameId}`)} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
