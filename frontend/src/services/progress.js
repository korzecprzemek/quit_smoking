// The only file that knows where data lives (currently localStorage).
// Later we replace the insides with fetch() calls to FastAPI;
// components keep calling the same functions.

const SETTINGS_KEY = "puffless.settings";
const GAMES_KEY = "puffless.completedGames";
const CRAVINGS_KEY = "puffless.cravings";

// Old keys from before this service existed, so existing data isn't lost.
const LEGACY_QUIT_DATE_KEY = "quitDate";
const LEGACY_CIGARETTES_KEY = "cigarettesPerDay";

const DEFAULT_SETTINGS = {
  quitDate: "2026-08-23T08:00",
  cigarettesPerDay: 15,
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    // Corrupted JSON or storage blocked: don't crash the app.
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Local calendar day as "YYYY-MM-DD".
// Not toISOString(): that is UTC, so just after local midnight it can still
// return yesterday (or tomorrow), which would break streaks.
export function toDayString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getSettings() {
  const stored = readJSON(SETTINGS_KEY, null);
  if (stored) {
    return { ...DEFAULT_SETTINGS, ...stored };
  }

  // First run with the new service: migrate the old separate keys.
  const legacyQuitDate = localStorage.getItem(LEGACY_QUIT_DATE_KEY);
  const legacyCigarettes = localStorage.getItem(LEGACY_CIGARETTES_KEY);

  return {
    quitDate: legacyQuitDate ?? DEFAULT_SETTINGS.quitDate,
    cigarettesPerDay:
      legacyCigarettes !== null
        ? Number(legacyCigarettes)
        : DEFAULT_SETTINGS.cigarettesPerDay,
  };
}

// Accepts a partial update, saves the merged result and returns it,
// so the caller can put it straight into React state.
export function saveSettings(changes) {
  const updated = { ...getSettings(), ...changes };
  writeJSON(SETTINGS_KEY, updated);
  return updated;
}

// Each entry: { type: "breathing", date: "2026-11-12" }
export function getCompletedGames() {
  return readJSON(GAMES_KEY, []);
}

// Saves the new entry and returns the full updated list (same pattern as
// saveSettings), so the caller can put it straight into React state.
export function completeGame(type) {
  const entry = { type, date: toDayString() };
  const updated = [...getCompletedGames(), entry];
  writeJSON(GAMES_KEY, updated);
  return updated;
}

// Each entry: { date: "2026-11-12", at: "<ISO timestamp>", resisted: true }
// `at` keeps the exact time, so later we can see which hours are hardest.
export function getCravings() {
  return readJSON(CRAVINGS_KEY, []);
}

// Saves a craving outcome and returns the full updated list.
export function logCraving(resisted) {
  const now = new Date();
  const entry = { date: toDayString(now), at: now.toISOString(), resisted };
  const updated = [...getCravings(), entry];
  writeJSON(CRAVINGS_KEY, updated);
  return updated;
}
