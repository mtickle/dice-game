import DataTable from '@layouts/data_table';
import { loadThingsFromDatabase } from '@utils/storageUtils';
import { lowerCategories, prettyName, upperCategories } from '@utils/utils';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

export default function GameHistoryTable({ refreshKey }) {
    const [gameStats, setGameStats] = useState([]);

    useEffect(() => {
        const fetchGameHistory = async () => {
            try {
                const fetchedStats = await loadThingsFromDatabase('getGameResults', 'mtickle');

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
                    console.warn('[GameHistoryTable] Duplicate gameNumbers found:', duplicates);
                }
            } catch (err) {
                console.error('[GameHistoryTable] Failed to fetch game history:', err);
            }
        };

        const timeout = setTimeout(() => fetchGameHistory(), 100);
        return () => clearTimeout(timeout);
    }, [refreshKey]);

    const columns = useMemo(() => {
        const baseColumns = [
            {
                id: 'gameNumber',
                Header: 'Game #',
                accessor: d => d.gameNumber || d.gamenumber,
            },
            {
                id: 'player',
                Header: 'Player',
                accessor: d => d.gameplayer || 'Anonymous',
            },
        ];

        const categoryColumns = [...upperCategories, ...lowerCategories].map((cat) => ({
            id: cat,
            Header: prettyName(cat),
            accessor: d => d[cat] ?? '-',
        }));

        const footerColumns = [
            {
                id: 'grandtotal',
                Header: 'Total',
                accessor: d => d.grandtotal ?? d.totalScore ?? '-',
            },
            {
                id: 'timestamp',
                Header: 'Date',
                accessor: d => moment(d.timestamp).format('YYYY-MM-DD HH:mm'),
            },
        ];

        return [...baseColumns, ...categoryColumns, ...footerColumns];
    }, []);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto p-4">
            <h2 className="text-lg font-semibold mb-4">📜 Game History</h2>
            {gameStats.length > 0 ? (
                DataTable(columns, gameStats)
            ) : (
                <div className="text-gray-500">No game history available.</div>
            )}
        </div>
    );
}
