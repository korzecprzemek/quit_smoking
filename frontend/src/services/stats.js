// Pure functions behind the home-screen numbers. They never trust their
// input: an empty, invalid or future quit date means 0, not NaN.

const SECONDS_PER_DAY = 24 * 60 * 60;

export function getSmokeFreeSeconds(quitDate, now) {
  if (!quitDate) return 0;
  const milliseconds = now - new Date(quitDate);
  return Number.isFinite(milliseconds)
    ? Math.max(0, Math.floor(milliseconds / 1000))
    : 0;
}

export function getCigarettesAvoided(smokeFreeSeconds, cigarettesPerDay) {
  return Math.floor((smokeFreeSeconds / SECONDS_PER_DAY) * cigarettesPerDay);
}

export function getMoneySaved(cigarettesAvoided, cigarettesPerPack, packPrice) {
  if (!(cigarettesPerPack > 0)) return 0;
  return (cigarettesAvoided / cigarettesPerPack) * packPrice;
}
