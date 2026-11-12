import { getSmokeFreeSeconds } from "../../services/stats";

function SmokeFreeClock({ quitDate, now }) {
  const smokeFreeSeconds = getSmokeFreeSeconds(quitDate, now);

  const days = Math.floor(smokeFreeSeconds / (24 * 60 * 60));
  const hours = Math.floor((smokeFreeSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((smokeFreeSeconds % (60 * 60)) / 60);
  const seconds = smokeFreeSeconds % 60;

  const padTime = (value) => String(value).padStart(2, "0");

  return (
    <div className="hero-card">
      <span>Smoke free</span>
      <strong className="timer">
        <span>{days} days</span>
        {padTime(hours)}:{padTime(minutes)}:{padTime(seconds)}
      </strong>
    </div>
  );
}

export default SmokeFreeClock;