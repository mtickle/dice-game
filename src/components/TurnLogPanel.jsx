import { useEffect } from 'react';

export default function TurnLogPanel({ gameLog, turnLog, gameNumber, showAllTurns }) {
    useEffect(() => {
        console.log('[TurnLogPanel] Props:', { gameLog, turnLog, gameNumber, showAllTurns });
    }, [gameLog, turnLog, gameNumber, showAllTurns]);

    const logToDisplay = showAllTurns ? turnLog : gameLog;

    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">
                Turn History
            </div>
            <div className="bg-gray-50 px-4 py-3 text-gray-500">
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
                            {logToDisplay.map((turn, index) => {
                                const diceToShow = Array.isArray(turn.dice) ? turn.dice : Array(5).fill(null);
                                const rollCount = typeof turn.rollCount === 'number' ? turn.rollCount : 0;
                                const category = turn.category || 'N/A';
                                const score = typeof turn.score === 'number' ? turn.score : 0;
                                const bonus = typeof turn.bonus === 'number' ? turn.bonus : 0;
                                const timestamp = turn.timestamp ? new Date(turn.timestamp).toLocaleString() : 'Invalid Date';

                                return (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{turn.turnNumber || index + 1}</td>
                                        <td className="p-2">{diceToShow.join(', ') || 'N/A'}</td>
                                        <td className="p-2">{rollCount}</td>
                                        <td className="p-2">{category}</td>
                                        <td className="p-2">{score}</td>
                                        <td className="p-2">{bonus}</td>
                                        <td className="p-2">{timestamp}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}