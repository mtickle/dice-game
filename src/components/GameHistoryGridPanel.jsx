import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { loadFromStorage } from '@utils/storageUtils';
import { prettyName } from '@utils/utils';
import { useEffect, useMemo, useState } from 'react';

export default function GameHistoryGridPanel({ gameStats: initialGameStats, refreshKey }) {
    const [sorting, setSorting] = useState([]);
    const [gameStats, setGameStats] = useState(initialGameStats || []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            console.log('[GameHistoryGridPanel] Loading gameStats from localStorage');
            let storedStats = [];
            try {
                const storedData = loadFromStorage('gameStats');
                if (storedData) {
                    //storedStats = JSON.parse(storedData || '[]');
                    //storedStats = JSON.parse(storedData || '[]');
                    if (!Array.isArray(storedStats)) {
                        console.warn('[GameHistoryGridPanel] Invalid gameStats format in localStorage; expected array.');
                        storedStats = [];
                    }
                }
            } catch (err) {
                console.error('[GameHistoryGridPanel] Error parsing gameStats from localStorage:', err);
                storedStats = [];
            }

            if (storedStats.length === 0 && initialGameStats && Array.isArray(initialGameStats)) {
                storedStats = initialGameStats;
            }

            setGameStats(storedStats);

            const gameNumbers = storedStats.map(game => game.gameNumber);
            const duplicates = gameNumbers.filter((num, i) => gameNumbers.indexOf(num) !== i);
            if (duplicates.length > 0) {
                console.warn('[GameHistoryGridPanel] Duplicate gameNumbers found:', duplicates);
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [initialGameStats, refreshKey]);

    const categoryOrder = [
        'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeOfAKind', 'fourOfAKind', 'fullHouse',
        'smallStraight', 'largeStraight', 'yahtzee', 'chance'
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
        </div>
    );
}
