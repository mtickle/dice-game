import { prettyName } from '@utils/utils';
import { useEffect, useState } from 'react';

export default function TurnLogPanel({ gameLog, turnLog, gameNumber, showAllTurns }) {
    const [openIndices, setOpenIndices] = useState([]);

    useEffect(() => {
        console.log('[TurnLogPanel] Props:', { gameLog, turnLog, gameNumber, showAllTurns });
        console.log('[TurnLogPanel] filteredLog:', filteredLog);
    }, [gameLog, turnLog, gameNumber, showAllTurns]);

    const filteredLog = showAllTurns ? turnLog : turnLog.filter((entry) => (entry?.gameNumber || 0) === (gameNumber || 1));

    const toggleAccordion = (index) => {
        setOpenIndices((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    if (!filteredLog || filteredLog.length === 0) {
        return (
            <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">
                    {showAllTurns ? 'All Turns' : `Turn Log (Game ${gameNumber || 1})`}
                </div>
                <div className="bg-gray-50 px-4 py-3 text-gray-500">
                    No turns recorded yet.
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">
                {showAllTurns ? 'All Turns' : `Turn Log (Game ${gameNumber || 1})`}
            </div>
            <div className="bg-gray-50 px-4 py-3">
                <div className="max-h-[400px] overflow-y-auto">
                    {filteredLog.slice().reverse().map((entry, index) => {
                        const isOpen = openIndices.includes(index);
                        console.log('[TurnLogPanel] Rendering entry:', entry);
                        if (!entry || typeof entry !== 'object') {
                            return null;
                        }
                        const { gameNumber = 1, turnNumber = 0, category = 'Unknown', score = 0, dice = [], bonus = false, timestamp } = entry;
                        const displayCategory = prettyName(category);
                        const displayDice = Array.isArray(dice) ? dice.join(', ') : 'N/A';
                        const displayTimestamp = timestamp ? new Date(timestamp).toLocaleString() : 'N/A';
                        return (
                            <div
                                key={`${gameNumber}-${turnNumber}-${index}`}
                                className="mb-2 rounded-md border border-gray-300 bg-white transition-all duration-200"
                            >
                                <button
                                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-100 focus:outline-none"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <span>
                                        Game {gameNumber}, Turn {turnNumber}: {displayCategory} = {score}
                                        {bonus ? ' (+10 bonus)' : ''}
                                    </span>
                                    <svg
                                        className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'} bg-gray-50`}
                                >
                                    <div className="px-4 py-3 text-sm text-gray-700">
                                        <p><strong>Dice:</strong> {displayDice}</p>
                                        <p><strong>Score:</strong> {score}</p>
                                        <p><strong>Bonus:</strong> {bonus ? '10' : '0'}</p>
                                        <p><strong>Timestamp:</strong> {displayTimestamp}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}