import { prettyName } from '../utils/utils';

export default function GameLogPanel({ gameLog, gameNumber }) {
    const filteredLog = gameLog.filter(
        (entry) => entry.gameNumber === gameNumber || gameLog === gameLog // Show all if turnLog
    );

    //console.log('[GameLogPanel] gameLog:', gameLog.length, 'filtered:', filteredLog.length);

    return (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Turn Log (Game {gameNumber})</h2>
            <div className="max-h-[400px] overflow-y-auto">
                {filteredLog.slice().reverse().map((entry, index) => (
                    <div key={`${entry.gameNumber}-${entry.turnNumber}-${index}`} className="mb-2 p-2 border-b">
                        <p>
                            <strong>Game {entry.gameNumber}, Turn {entry.turnNumber}:</strong>{' '}
                            {prettyName(entry.category)} = {entry.score} {entry.bonus ? '(+10 bonus)' : ''}
                        </p>
                        <p>
                            <strong>Dice:</strong> {entry.dice.join(', ')}
                        </p>
                        <p>
                            <strong>Timestamp:</strong> {entry.timestamp}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}