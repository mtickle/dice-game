import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { getDiceSvg } from '@utils/diceIcons';
import { getUsedDiceIndexesForCategory } from '@utils/diceUtils';
import { prettyName } from '@utils/utils';
import { useMemo, useState } from 'react';

export default function GameHistoryTable({
    gameStats = [],
    turnHistory = [],
    selectedGameNumber,
    setSelectedGameNumber,
}) {
    const [sorting, setSorting] = useState([]);

    const columnOrder = [
        'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'evens', 'odds', 'onepair', 'twopair',
        'threeofakind', 'fourofakind', 'fullhouse',
        'smallstraight', 'largestraight', 'yahtzee', 'chance',
        'uppertotal', 'upperbonus', 'lowertotal', 'grandtotal'
    ];

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
            cell: ({ row }) => row.original[col] ?? '-',
        }))
    ], [setSelectedGameNumber]);

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

    if (!Array.isArray(gameStats) || gameStats.length === 0) {
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
                                                {flexRender(header.column.columnDef.header, header.getContext())}
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
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-700 px-2 pt-2">
                <div>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</div>
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

            {selectedGameNumber && (
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
                            <h3 className="text-lg font-medium text-gray-700 mb-2">
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
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Roll</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Category</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Score</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Bonus?</th>
                                            <th className="px-3 py-2 border-b border-gray-300 text-left">Dice</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {turnHistory.filter(turn => String(turn.gamenumber) === String(selectedGameNumber))
                                            .map((turn, index) => (
                                                <tr
                                                    key={index}
                                                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                                                >
                                                    <td className="px-3 py-2 border-b border-gray-100">{turn.turnnumber}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100">{turn.rollcount}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100">{prettyName(turn.category) || '(uncategorized)'}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100">{turn.score ?? '-'}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100">{turn.bonus ?? '-'}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100">
                                                        {Array.isArray(turn.dice)
                                                            ? (() => {
                                                                const dice = [...turn.dice];
                                                                const usedFlags = getUsedDiceIndexesForCategory(turn.category, dice);
                                                                return dice.map((die, i) => {
                                                                    const isUsed = usedFlags[i];
                                                                    const bg = isUsed ? '#fef9c3' : '#fff';
                                                                    return <span key={`${index}-${i}`}>{getDiceSvg(die, bg)}</span>;
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
