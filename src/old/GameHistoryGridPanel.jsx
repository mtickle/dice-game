import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { useAuth0 } from '@auth0/auth0-react'; // <-- Auth0 import
import { loadThingsFromDatabase } from '@utils/storageUtils';
import { prettyName } from '@utils/utils';
import { useEffect, useMemo, useState } from 'react';

export default function GameHistoryGridPanel({ gameStats: initialGameStats, refreshKey }) {
    const { user, isAuthenticated } = useAuth0();
    const playerName = user?.nickname || user?.name || user?.email || null;

    const [sorting, setSorting] = useState([]);
    const [gameStats, setGameStats] = useState(initialGameStats || []);
    const [selectedGameNumber, setSelectedGameNumber] = useState(null);
    const [turnHistory, setTurnHistory] = useState([]);
    const [loadingTurns, setLoadingTurns] = useState(false);

    const columnOrder = [
        'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'evens', 'odds', 'onepair', 'twopair',
        'threeofakind', 'fourofakind', 'fullhouse',
        'smallstraight', 'largestraight', 'yahtzee', 'chance',
        'uppertotal', 'upperbonus', 'lowertotal', 'grandtotal'
    ];

    // Fetch all game stats for the logged-in player
    useEffect(() => {
        if (!playerName) return;

        const fetchGameStats = async () => {
            try {
                const fetchedStats = await loadThingsFromDatabase('getAllGameResults', playerName);
                const normalize = (obj) => {
                    const result = {};
                    for (const key in obj) {
                        const num = Number(obj[key]);
                        result[key] = isNaN(num) ? obj[key] : num;
                    }
                    return result;
                };
                const normalizedGames = fetchedStats.map(normalize);
                setGameStats(normalizedGames);
            } catch (err) {
                console.error('[GameHistoryGridPanel] Failed to fetch game stats:', err);
            }
        };

        fetchGameStats();
    }, [playerName, refreshKey]);

    // Fetch turns for a specific game when selectedGameNumber changes
    useEffect(() => {
        if (!playerName || !selectedGameNumber) {
            setTurnHistory([]);
            return;
        }

        const fetchTurnsForGame = async () => {
            setLoadingTurns(true);
            try {
                // This assumes loadThingsFromDatabase supports fetching by gamenumber
                // If not, you can write a fetch call like:
                // const response = await fetch(`/api/getTurnsByGame/${playerName}/${selectedGameNumber}`);
                // const turns = await response.json();

                const turns = await loadThingsFromDatabase('getTurnsByGame', playerName, selectedGameNumber);

                console.log(turns)

                const normalize = (obj) => {
                    const result = {};
                    for (const key in obj) {
                        const num = Number(obj[key]);
                        result[key] = isNaN(num) ? obj[key] : num;
                    }
                    return result;
                };

                const normalizedTurns = turns.map(normalize);
                setTurnHistory(normalizedTurns);
            } catch (err) {
                console.error('[GameHistoryGridPanel] Failed to fetch turns for game:', err);
                setTurnHistory([]);
            } finally {
                setLoadingTurns(false);
            }
        };

        fetchTurnsForGame();
    }, [playerName, selectedGameNumber]);


    const columns = useMemo(() => [
        {
            accessorKey: 'gamenumber',
            header: () => 'Game #',
            enableSorting: true,
            cell: ({ row }) => (
                <button
                    onClick={() => setSelectedGameNumber(row.original.gamenumber)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                >
                    {row.original.gamenumber || '-'}
                </button>
            ),
        },
        ...columnOrder.map(col => ({
            accessorKey: col,
            header: () => prettyName(col),
            enableSorting: true,
            cell: ({ row }) =>
                row.original[col] !== undefined
                    ? row.original[col]
                    : '-',
        }))
    ], [columnOrder]);

    const table = useReactTable({
        data: gameStats,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const closeModal = () => setSelectedGameNumber(null);

    if (!playerName) {
        return (
            <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm p-4 text-center text-gray-600">
                Please log in to see your game history.
            </div>
        );
    }

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
        <div className="flex flex-col gap-4 justify-center bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc] w-full">
            <div className="border-b border-gray-200 px-4 py-3 text-lg font-semibold text-gray-800">
                Game History
            </div>

            <div className="bg-gray-50 relative overflow-y-auto max-h-[500px]">
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between text-sm text-gray-700 px-2 pt-2">
                <div>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Turn History Modal */}
            {/* Turn History Modal */}
            {/* {selectedGameNumber && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Turn History for Game #{selectedGameNumber} FUCK
                            </h3>
                        </div>

                        <div className="relative max-h-[70vh] overflow-y-auto px-6 pb-6">
                            {loadingTurns ? (
                                <p className="text-gray-500">Loading turn history...</p>
                            ) : turnHistory.length === 0 ? (
                                <p className="text-gray-500">No turn history available for this game.</p>
                            ) : (
                                <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-0">
                                    <thead className="bg-gray-100 text-xs text-gray-600 uppercase sticky top-0 z-20">
                                        <tr>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Turn</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Roll</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Category</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Score</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Dice</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {turnHistory
                                            .filter(turn => String(turn.gamenumber) === String(selectedGameNumber))
                                            .map((turn, index) => {
                                                const rawDice = typeof turn.dice === 'string'
                                                    ? turn.dice.replace(/[{}"]/g, '')
                                                    : '';
                                                const dice = rawDice ? rawDice.split(',').map(Number) : [];

                                                const usedFlags = getUsedDiceIndexesForCategory(turn.category, dice);

                                                return (
                                                    <tr
                                                        key={index}
                                                        className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                                                    >
                                                        <td className="px-3 py-2 border-b border-gray-100">
                                                            {turn.turnnumber ?? index + 1}
                                                        </td>
                                                        <td className="px-3 py-2 border-b border-gray-100">
                                                            {turn.roll}
                                                        </td>
                                                        <td className="px-3 py-2 border-b border-gray-100">
                                                            {prettyName(turn.category) || '(uncategorized)'}
                                                        </td>
                                                        <td className="px-3 py-2 border-b border-gray-100">
                                                            {turn.score ?? '-'}
                                                        </td>
                                                        <td className="px-3 py-2 border-b border-gray-100">
                                                            {dice.length === 5 ? (
                                                                dice.map((die, i) => {
                                                                    const isUsed = usedFlags[i];
                                                                    const bg = isUsed ? '#fef9c3' : '#fff';
                                                                    return (
                                                                        <span key={`${index}-${i}`}>
                                                                            {getDiceSvg(die, bg)}
                                                                        </span>
                                                                    );
                                                                })
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )} */}

        </div>
    );
}
