import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import CravingScreen from "./components/CravingScreen";
import Dashboard from "./components/Dashboard";
import GamePage from "./components/GamePage";
import OnboardingView from "./components/OnboardingView";
import SettingsView from "./components/SettingsView";
import {
  completeGame,
  getCompletedGames,
  getCravings,
  getSettings,
  logCraving,
  saveSettings,
} from "./services/progress";
import { applyTheme } from "./services/theme";

// Owns the data (settings, games, cravings, the clock) and the routes.
// Each route's component decides how to display it.
function App() {
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [settings, setSettings] = useState(getSettings);
  const [games, setGames] = useState(getCompletedGames);
  const [cravings, setCravings] = useState(getCravings);

  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  function handleGameComplete(gameId) {
    setGames(completeGame(gameId));
  }

  function handleCravingLogged(resisted) {
    setCravings(logCraving(resisted));
    navigate("/");
  }

  // First run: no quit date yet, so collect the basics before anything else.
  if (settings.quitDate === null) {
    return (
      <OnboardingView
        onComplete={(values) => setSettings(saveSettings(values))}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            now={now}
            settings={settings}
            games={games}
            cravings={cravings}
          />
        }
      />
      <Route
        path="/settings"
        element={
          <SettingsView
            settings={settings}
            onChange={(changes) => setSettings(saveSettings(changes))}
            onBack={() => navigate("/")}
          />
        }
      />
      <Route
        path="/games/:gameId"
        element={<GamePage onComplete={handleGameComplete} />}
      />
      <Route
        path="/craving"
        element={
          <CravingScreen
            onGameComplete={handleGameComplete}
            onLog={handleCravingLogged}
            onCancel={() => navigate("/")}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
