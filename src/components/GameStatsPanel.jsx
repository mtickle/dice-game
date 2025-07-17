import { loadThingsFromDatabase } from '@utils/storageUtils';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';

import { allCategories, prettyName } from '@utils/utils';
import { useEffect, useMemo, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import GameHistoryTable from './GameHistoryTable';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

export default function GameStatsPanel({ refreshKey }) {
    const [gameStats, setGameStats] = useState([]);
    const [turnLog, setTurnLog] = useState([]);
    const [selectedGameNumber, setSelectedGameNumber] = useState(null);

    useEffect(() => {
        const fetchStatsAndTurns = async () => {
            try {
                const fetchedGameStats = await loadThingsFromDatabase('getAllGameResults', 'mtickle');
                const normalizeGame = (game) => {
                    const result = {};
                    for (const key in game) {
                        const value = game[key];
                        const num = Number(value);
                        result[key] = isNaN(num) ? value : num;
                    }
                    return result;
                };
                setGameStats(Array.isArray(fetchedGameStats) ? fetchedGameStats.map(normalizeGame) : []);

                const fetchedTurnLog = await loadThingsFromDatabase('getAllTurnResults', 'mtickle');
                const normalizedTurnLog = Array.isArray(fetchedTurnLog)
                    ? fetchedTurnLog.map((turn) => {
                        let diceArray = [];
                        if (typeof turn.dice === 'string') {
                            try {
                                const cleanedDice = turn.dice
                                    .replace(/[{'}]/g, '')
                                    .split(',')
                                    .map((item) => item.replace(/['"]/g, '').trim());
                                diceArray = cleanedDice.map(Number).filter((num) => !isNaN(num) && num >= 1 && num <= 6);
                            } catch (err) {
                                console.warn(`Failed to parse dice string for turn ${turn.gameNumber}:`, turn.dice, err);
                            }
                        } else if (Array.isArray(turn.dice)) {
                            diceArray = turn.dice.map(Number).filter((num) => !isNaN(num) && num >= 1 && num <= 6);
                        }

                        return {
                            ...turn,
                            score: Number(turn.score) || 0,
                            dice: diceArray,
                            gameNumber: Number(turn.gameNumber) || 0,
                        };
                    })
                    : [];

                setTurnLog(normalizedTurnLog);
            } catch (err) {
                console.error('Failed to load stats or turns from API:', err);
                setGameStats([]);
                setTurnLog([]);
            }
        };

        fetchStatsAndTurns();
    }, [refreshKey]);

    const summaryStats = useMemo(() => {
        if (!gameStats || gameStats.length === 0) {
            return {
                gamesPlayed: 0,
                lowestScore: 0,
                highestScore: 0,
                averageScore: 0,
            };
        }

        const scores = gameStats
            .map(g => g.grandtotal)
            .filter(score => typeof score === 'number' && isFinite(score));

        const gamesPlayed = scores.length;
        const lowestScore = gamesPlayed > 0 ? Math.min(...scores) : 0;
        const highestScore = gamesPlayed > 0 ? Math.max(...scores) : 0;
        const averageScore = gamesPlayed > 0
            ? scores.reduce((a, b) => a + b, 0) / gamesPlayed
            : 0;

        return {
            gamesPlayed,
            lowestScore,
            highestScore,
            averageScore: Number(averageScore.toFixed(2)),
        };
    }, [gameStats]);

    const chartData = useMemo(() => {
        if (!gameStats.length) return null;

        const totalScores = gameStats.map(g => g.totalScore || g.grandtotal || 0);
        const meanScore = totalScores.reduce((a, b) => a + b, 0) / totalScores.length;

        const totalScoresData = {
            labels: gameStats.slice(-30).map((g, i, arr) => `Game ${gameStats.length - arr.length + i + 1}`),
            datasets: [
                {
                    label: 'Total Score',
                    data: totalScores.slice(-30),
                    borderColor: '#2563eb',
                    backgroundColor: '#2563eb',
                    fill: false,
                    tension: 0.1,
                },
                {
                    label: 'Mean Score',
                    data: Array(Math.min(30, gameStats.length)).fill(meanScore),
                    borderColor: '#EF4444',
                    backgroundColor: '#EF4444',
                    borderDash: [2, 2],
                    pointRadius: 0,
                    fill: false,
                }
            ]
        };

        const categories = allCategories.filter(cat =>
            gameStats.some(game => {
                const val = Number(game[cat]);
                return !isNaN(val) && isFinite(val);
            })
        );

        const avgScores = categories.map(cat => {
            const total = gameStats.reduce((sum, game) => {
                const val = Number(game[cat]);
                return isFinite(val) ? sum + val : sum;
            }, 0);
            return total / gameStats.length || 0;
        });
        const avgScoresData = {
            labels: categories.map(prettyName),
            datasets: [
                {
                    label: 'Average Score',
                    data: avgScores,
                    backgroundColor: [
                        '#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899',
                        '#F97316', '#6EE7B7', '#D1D5DB', '#F43F5E', '#7C3AED', '#FBBF24',
                        '#34D399', '#60A5FA', '#A78BFA', '#E11D48', '#059669',
                    ],
                    borderColor: '#1F2937',
                    borderWidth: 1,
                }
            ]
        };

        const dieFrequency = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        turnLog.forEach(turn => {
            if (Array.isArray(turn?.dice)) {
                turn.dice.forEach(die => {
                    if (die >= 1 && die <= 6) dieFrequency[die]++;
                });
            }
        });

        const dieFrequencyData = {
            labels: ['1s', '2s', '3s', '4s', '5s', '6s'],
            datasets: [
                {
                    label: 'Rolled Dice',
                    data: [1, 2, 3, 4, 5, 6].map(i => dieFrequency[i]),
                    backgroundColor: [
                        '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
                    ],
                    borderColor: '#1F2937',
                    borderWidth: 1
                }
            ]
        };

        const zeroScores = categories.map(cat => {
            return gameStats.reduce((count, game) => {
                const score = game[cat];
                return count + (score === 0 || score === undefined ? 1 : 0);
            }, 0);
        });

        const zeroScoresData = {
            labels: categories.map(prettyName),
            datasets: [
                {
                    label: 'Zero Scores',
                    data: zeroScores,
                    backgroundColor: [
                        '#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899',
                        '#F97316', '#6EE7B7', '#D1D5DB', '#F43F5E', '#7C3AED', '#FBBF24',
                        '#34D399', '#60A5FA', '#A78BFA', '#E11D48', '#059669',
                    ],
                    borderColor: '#1F2937',
                    borderWidth: 1
                }
            ]
        };

        return { totalScoresData, avgScoresData, dieFrequencyData, zeroScoresData };
    }, [gameStats, turnLog]);

    return (
        <div className="mb-4 border border-gray-200 bg-white shadow-sm rounded-t-2xl rounded-b-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 shadow-md flex justify-between items-center rounded-t-2xl">
                <h3 className="text-1xl font-semibold tracking-tight">📊 Game Statistics</h3>
            </div>
            {!chartData ? (
                <div className="bg-gray-50 px-4 py-3 text-gray-500">No data available.</div>
            ) : (
                <div className="space-y-6 p-6">
                    <div className="flex flex-wrap justify-around items-center gap-6 text-6xl font-bold text-gray-800">
                        <div className="flex-1 min-w-[150px] text-center bg-[#fffdf7] p-6 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                            {summaryStats.gamesPlayed}
                            <div className="text-sm text-gray-600 mt-2">Games Played</div>
                        </div>
                        <div className="flex-1 min-w-[150px] text-center bg-[#fffdf7] p-6 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                            {summaryStats.lowestScore}
                            <div className="text-sm text-gray-600 mt-2">Lowest Score</div>
                        </div>
                        <div className="flex-1 min-w-[150px] text-center bg-[#fffdf7] p-6 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                            {summaryStats.highestScore}
                            <div className="text-sm text-gray-600 mt-2">Highest Score</div>
                        </div>
                        <div className="flex-1 min-w-[150px] text-center bg-[#fffdf7] p-6 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                            {summaryStats.averageScore}
                            <div className="text-sm text-gray-600 mt-2">Average Score</div>
                        </div>
                    </div>

                    <div className="w-full bg-[#fffdf7] p-6 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Total Scores Over Last 30 Games</h3>
                        <div className="w-full h-[250px] p-2">
                            <Line data={chartData.totalScoresData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { title: { display: true, text: 'Game Number' } },
                                    y: { title: { display: true, text: 'Total Score' }, beginAtZero: true },
                                },
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'top',
                                        labels: { color: '#374151', font: { size: 12 } },
                                    },
                                },
                            }} />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        {/* Average Score per Category - Full Width */}
                        <div className="w-full">
                            <div className="w-full bg-[#fffdf7] p-6 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Average Score Per Category</h3>
                                <div className="w-full h-[250px] p-2">
                                    <Bar
                                        data={chartData.avgScoresData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                x: { title: { display: false } },
                                                y: { title: { display: false }, beginAtZero: true },
                                            },
                                            plugins: { legend: { display: false } },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Die Distribution */}
                        <div className="flex-1 min-w-[300px]">
                            <div className="w-full bg-[#fffdf7] p-6 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Die Distribution</h3>
                                <div className="w-full h-[250px] p-2">
                                    <Pie
                                        data={chartData.dieFrequencyData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    position: 'right',
                                                    labels: { color: '#374151', font: { size: 14 } },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Zero Score Frequency */}
                        <div className="flex-1 min-w-[300px]">
                            <div className="w-full bg-[#fffdf7] p-6 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Zero Score Frequency</h3>
                                <div className="w-full h-[250px] p-2">
                                    <Bar
                                        data={chartData.zeroScoresData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                x: { title: { display: true, text: 'Category' } },
                                                y: {
                                                    title: { display: true, text: 'Number of Zero Scores' },
                                                    beginAtZero: true,
                                                    ticks: { stepSize: 1, precision: 0 },
                                                    grid: { color: '#e5e7eb' },
                                                },
                                            },
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    backgroundColor: '#1f2937',
                                                    titleFont: { size: 14 },
                                                    bodyFont: { size: 12 },
                                                    callbacks: {
                                                        label: (context) => `${context.raw} zero scores`,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <GameHistoryTable
                        gameStats={gameStats}
                        turnHistory={turnLog}
                        selectedGameNumber={selectedGameNumber}
                        setSelectedGameNumber={setSelectedGameNumber}
                    />
                </div>
            )}
        </div>
    );
}
