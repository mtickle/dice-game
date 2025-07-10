import { loadFromStorage } from '@utils/storageUtils';
import { prettyName } from '@utils/utils';
import { useEffect, useState } from 'react';

export default function GameHistoryPanel({ gameStats, refreshKey }) {
    const [openIndices, setOpenIndices] = useState([]);

    useEffect(() => {
        // Debug log to check for duplicate gameNumbers
        // console.log('[GameHistoryPanel] gameStats:', gameStats);
        const gameNumbers = gameStats.map(game => game.gameNumber);
        const duplicates = gameNumbers.filter((num, index) => gameNumbers.indexOf(num) !== index);
        if (duplicates.length > 0) {
            console.warn('[GameHistoryPanel] Duplicate gameNumbers found:', duplicates);
        }

        // Fallback: Log errors if gameStats is empty
        if (!gameStats || gameStats.length === 0) {
            try {
                const storedStats = loadFromStorage('gameStats');
                if (storedStats) {
                    const parsedStats = JSON.parse(storedStats);
                    if (!Array.isArray(parsedStats)) {
                        console.warn('[GameHistoryPanel] Invalid gameStats format; expected array.');
                    }
                }
            } catch (error) {
                console.error('[GameHistoryPanel] Error parsing gameStats:', error);
            }
        }
    }, [gameStats, refreshKey]);

    const toggleAccordion = (index) => {
        setOpenIndices((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    if (!gameStats || !Array.isArray(gameStats) || gameStats.length === 0) {
        return (
            <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">
                    Game History
                </div>
                <div className="bg-gray-50 px-4 py-3 text-gray-500">
                    No games recorded yet.
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">
                Game History hoho
            </div>
            <div className="bg-gray-50 px-4 py-3">
                <div className="mt-3">
                    {gameStats.slice().reverse().map((game, index) => {
                        const isOpen = openIndices.includes(index);
                        return (
                            <div
                                key={`${game.gameNumber || index}-${index}`} // Ensure uniqueness with index
                                className="mb-2 rounded-md border border-gray-300 bg-white"
                            >
                                <button
                                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-100 focus:outline-none"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <span>
                                        Game {game.gameNumber} – {game.totalScore} points (
                                        {new Date(game.timestamp).toLocaleString()})
                                    </span>
                                    <svg
                                        className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                                >
                                    <div className="px-4 py-3 text-sm text-gray-700">
                                        <div className="text-left grid grid-cols-2 gap-2">
                                            {Object.entries(game.scores || {}).map(([category, score]) => (
                                                <div key={`${game.gameNumber}-${category}-${index}`}> {/* Unique per game and category */}
                                                    {prettyName(category)}: {score ?? 0}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2">Total Score: {game.totalScore}</div>
                                        <div className="text-gray-500 text-xs mt-1">
                                            Played: {new Date(game.timestamp).toLocaleString()}
                                        </div>
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