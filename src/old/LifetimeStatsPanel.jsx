export default function LifetimeStatsPanel({ stats, onReset }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Lifetime Stats</h2>
            <div className="space-y-2">
                {/* <div>Total Games: {stats.totalGames}</div> */}
                {/* <div>Total Score: {stats.totalScore}</div> */}
                {/* <div>Highest Score: {stats.highestScore}</div> */}
                {/* <div>Total Yahtzees: {stats.totalYahtzees}</div> */}
            </div>
            <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={onReset}
            >
                Reset Stats
            </button>
        </div>
    );
}
