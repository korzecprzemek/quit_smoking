function getCravingReward(count) {
    if(count >= 10) {
        return "🌳";
    }

    if(count >= 5) {
        return "🌸";
    }

    return null;
}

function CravingTracker({ count, onLogCraving }) {
    const reward = getCravingReward(count);
    
    return (
        <section>
            <button onClick={onLogCraving}>
                I'm having a craving
            </button>

            <p>Cravings logged: {count} </p>

            {reward && (
                <p className="reward" role="status">
                    {reward}
                </p>
            )}
        </section>
    );
}

export default CravingTracker;