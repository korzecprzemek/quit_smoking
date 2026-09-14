import { useEffect, useState } from "react";

const DEFAULT_INHALE_SECONDS = 4;
const DEFAULT_EXHALE_SECONDS = 6;

function BreathingGame({ onBack }) {
    const [elapsed, setElapsed] = useState(0);
    const [inhaleSeconds, setInhaleSeconds] = useState(DEFAULT_INHALE_SECONDS);
    const [exhaleSeconds, setExhaleSeconds] = useState(DEFAULT_EXHALE_SECONDS);

    const inhaleDuration = inhaleSeconds * 1000;
    const exhaleDuration = exhaleSeconds * 1000;

    const totalDuration = inhaleDuration + exhaleDuration;
    const cycleElapsed = elapsed % totalDuration;

    const phase = cycleElapsed < inhaleDuration ? "inhale" : "exhale";

    let fillPercentage;

    if (phase === "inhale") {
        fillPercentage = (cycleElapsed / inhaleDuration) * 100;
    } else {
        const exhaleElapsed = cycleElapsed - inhaleDuration;
        fillPercentage = 100 - (exhaleElapsed / exhaleDuration) * 100;
    }

    useEffect(() => {
        const timerId = setInterval(() => {
            setElapsed((current) => current + 100);
        }, 100);
        return () => clearInterval(timerId);
    }, []);

    return (
    <>
        <section className="breathing-page">
            <p>{phase === "inhale" ? "Breathe in" : "Slowly breathe out"}</p>
            <div className="breathing-bar">
                <div
                    className="breathing-bar-fill"
                    style={{width: `${fillPercentage}%`}}
                ></div>
            </div>
            <button type ="button"
            onClick={onBack}>Return to Dashboard</button>
        </section>
        <section className="breathing-controls">
            <label htmlFor="inhale-tempo">
                Breathe in: {inhaleSeconds} seconds
            </label>
            <input
                id="inhale-tempo"
                type="range"
                min="2"
                max="15"
                value={inhaleSeconds}
                onChange={(event) => setInhaleSeconds(Number(event.target.value))}
            />
            <label htmlFor="exhale-tempo">
                Breathe out: {exhaleSeconds} seconds
            </label>
            <input
                id="exhale-tempo"
                type="range"
                min="2"
                max="20"
                value={exhaleSeconds}
                onChange={(event) => setExhaleSeconds(Number(event.target.value))}
            />
        </section>
    </>
    );
}
export default BreathingGame;