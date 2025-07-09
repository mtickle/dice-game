import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { getDiceSvg } from '@utils/diceIcons';
import { getUsedDiceIndexesForCategory } from '@utils/diceUtils';
import { loadFromStorage, loadThingsFromDatabase } from '@utils/storageUtils';
import { prettyName } from '@utils/utils';
import { useEffect, useMemo, useState } from 'react';


export default function GameHistoryGridPanel({ gameStats: initialGameStats, refreshKey }) {
    const [sorting, setSorting] = useState([]);
    const [gameStats, setGameStats] = useState(initialGameStats || []);
    const [selectedGameNumber, setSelectedGameNumber] = useState(null);
    const [turnHistory, setTurnHistory] = useState([]);


    useEffect(() => {
        const fetchGameHistory = async () => {
            try {
                const fetchedStats = await loadThingsFromDatabase('getGameResults', 'mtickle');
                const columns = ['gameNumber', ...allCategories, 'grandtotal'];
                const normalizeGame = (game) => {
                    const result = {};
                    for (const key in game) {
                        const value = game[key];
                        const num = Number(value);
                        result[key] = isNaN(num) ? value : num;
                    }
                    return result;
                };

                const normalized = fetchedStats.map(normalizeGame);
                setGameStats(normalized);

                const gameNumbers = normalized.map(game => game.gameNumber);
                const duplicates = gameNumbers.filter((num, i) => gameNumbers.indexOf(num) !== i);
                if (duplicates.length > 0) {
                    //console.warn('[GameHistoryGridPanel] Duplicate gameNumbers found:', duplicates);
                }

            } catch (err) {
                console.error('[GameHistoryGridPanel] Failed to fetch game history:', err);
            }
        };

        const timeout = setTimeout(() => {
            fetchGameHistory();
        }, 100); // Optional: delay if needed to wait for backend propagation

        return () => clearTimeout(timeout);
    }, [refreshKey]);

    useEffect(() => {
        if (selectedGameNumber) {
            try {
                const storedTurnLog = loadFromStorage('turnLog') || [];
                if (!Array.isArray(storedTurnLog)) {
                    console.warn('[GameHistoryGridPanel] Invalid turnLog format in localStorage; expected array.');
                    setTurnHistory([]);
                } else {
                    const filteredTurns = storedTurnLog.filter(turn => turn.gameNumber === selectedGameNumber);
                    setTurnHistory(filteredTurns);
                }
            } catch (err) {
                console.error('[GameHistoryGridPanel] Error parsing turnLog from localStorage:', err);
                setTurnHistory([]);
            }
        }
    }, [selectedGameNumber]);

    const categoryOrder = [
        'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeofakind', 'fourofakind', 'fullhouse',
        'smallstraight', 'largestraight', 'yahtzee', 'chance'
    ];

    const allCategories = [...new Set(
        gameStats.flatMap(game => Object.keys(game.scores || {}))
    )].sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    const columns = useMemo(() => [
        {
            accessorKey: 'gameNumber',
            header: () => 'Game #',
            enableSorting: true,
            cell: ({ row }) => row.original.gameNumber || '-',
        },
        ...allCategories.map(category => ({
            accessorKey: category,
            header: () => prettyName(category),
            enableSorting: true,
            cell: ({ row }) =>
                row.original.scores?.[category] !== undefined
                    ? row.original.scores[category]
                    : '-',
        })),
        {
            accessorKey: 'totalScore',
            header: () => 'Total Score',
            enableSorting: true,
            cell: ({ row }) => {
                const score = row.original.totalScore || 0;
                let colorClass = 'text-gray-700';
                if (score >= 300) colorClass = 'text-green-600 font-semibold';
                else if (score < 200) colorClass = 'text-red-500 font-medium';
                return <span className={colorClass}>{score}</span>;
            },
        },
        {
            id: 'turnHistory',
            header: () => 'Turn History',
            cell: ({ row }) => (
                <button
                    onClick={() => setSelectedGameNumber(row.original.gameNumber)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                >
                    Show Turn History
                </button>
            ),
        },
    ], [allCategories]);

    const data = useMemo(() => gameStats.slice(), [gameStats]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const closeModal = () => setSelectedGameNumber(null);

    //--- No games recorded yet
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
        <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-md overflow-x-auto">
            <div className="border-b border-gray-200 px-4 py-3 text-lg font-semibold text-gray-800">
                Game History
            </div>
            {/* <GameHistoryTable

            /> */}
            <div className="bg-gray-50 relative overflow-y-auto h-[500px]">
                <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-0">
                    <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm text-xs text-gray-600 uppercase">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    const isSorted = header.column.getIsSorted();
                                    return (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="px-3 py-2 border-b border-gray-300 font-medium text-left cursor-pointer select-none whitespace-nowrap hover:bg-gray-200 transition"
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {isSorted === 'asc' ? '↑' : isSorted === 'desc' ? '↓' : ''}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors duration-100"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className="px-3 py-2 border-b border-gray-100 whitespace-nowrap"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Turn History */}
            {selectedGameNumber && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                        {/* Close Button - top right floating */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Turn History for Game #{selectedGameNumber}
                            </h3>
                        </div>

                        <div className="relative max-h-[70vh] overflow-y-auto px-6 pb-6">
                            {turnHistory.length === 0 ? (
                                <p className="text-gray-500">No turn history available for this game.</p>
                            ) : (
                                <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-0">
                                    <thead className="bg-gray-100 text-xs text-gray-600 uppercase sticky top-0 z-20">
                                        <tr>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Turn</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Category</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Score</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Dice</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {turnHistory.map((turn, index) => (
                                            <tr
                                                key={index}
                                                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                                            >
                                                <td className="px-3 py-2 border-b border-gray-100">{index + 1}</td>
                                                <td className="px-3 py-2 border-b border-gray-100">
                                                    {prettyName(turn.category) || '(uncategorized)'}
                                                </td>
                                                <td className="px-3 py-2 border-b border-gray-100">
                                                    {turn.score !== undefined ? turn.score : '-'}
                                                </td>
                                                <td className="px-3 py-2 border-b border-gray-100">
                                                    {Array.isArray(turn.dice)
                                                        ? (() => {
                                                            const dice = [...turn.dice];
                                                            const usedFlags = getUsedDiceIndexesForCategory(turn.category, dice);

                                                            return dice.map((die, i) => {
                                                                const isUsed = usedFlags[i];
                                                                const bg = isUsed ? '#fef9c3' : '#fff'; // Tailwind yellow-100
                                                                return (
                                                                    <span key={`${index}-${i}`}>
                                                                        {getDiceSvg(die, bg)}
                                                                    </span>
                                                                );
                                                            });
                                                        })()
                                                        : '-'}
                                                </td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}