export default function GameHistory({ gameLog }) {
    if (!gameLog || gameLog.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Game History</h2>
            <ul className="divide-y divide-gray-200">
                {gameLog.map((entry, index) => (
                    <li key={index} className="py-2 flex justify-between">
                        <span>{entry.category}</span>
                        <span>{entry.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
