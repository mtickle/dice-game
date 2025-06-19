import { useEffect } from 'react';

export default function TurnLogPanel({ gameLog, turnLog, gameNumber, showAllTurns }) {
    useEffect(() => {
        console.log('[TurnLogPanel] Props:', { gameLog, turnLog, gameNumber, showAllTurns });
    }, [gameLog, turnLog, gameNumber, showAllTurns]);

    const logToDisplay = showAllTurns ? turnLog : gameLog;

    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Game {gameNumber} Turn Log</h2>
            {logToDisplay.length === 0 ? (
                <p className="text-gray-500">No turns logged yet.</p>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border-b">Turn #</th>
                            <th className="p-2 border-b">Dice</th>
                            <th className="p-2 border-b">Rolls</th>
                            <th className="p-2 border-b">Category</th>
                            <th className="p-2 border-b">Score</th>
                            <th className="p-2 border-b">Bonus</th>
                            <th className="p-2 border-b">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logToDisplay.map((turn, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-2">{turn.turnNumber}</td>
                                <td className="p-2">{turn.dice.join(', ')}</td>
                                <td className="p-2">{turn.rollCount}</td>
                                <td className="p-2">{turn.category}</td>
                                <td className="p-2">{turn.score}</td>
                                <td className="p-2">{turn.bonus || 0}</td>
                                <td className="p-2">{new Date(turn.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}