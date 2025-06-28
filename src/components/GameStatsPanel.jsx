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
import { useEffect, useMemo, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { prettyName } from '../utils/utils';

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

import { loadFromStorage } from '@utils/storageUtils';

export default function GameStatsPanel({ gameStats: initialGameStats, turnLog: initialTurnLog, refreshKey }) {
    const [summaryStats, setSummaryStats] = useState({
        gamesPlayed: 0,
        lowestScore: Infinity,
        highestScore: -Infinity,
        averageScore: 0,
    });
    const [turnLog, setTurnLog] = useState([]);

    useEffect(() => {
        // Load and convert turnLog from localStorage
        let storedTurnLog = loadFromStorage('turnLog');
        if (storedTurnLog.length === 0 && initialTurnLog) {
            storedTurnLog = initialTurnLog;
        }
        const convertedTurnLog = storedTurnLog.map(turn => ({
            ...turn,
            category: turn?.category ? prettyName(turn.category) : '(uncategorized)',
        }));
        setTurnLog(convertedTurnLog);

        // Load and initialize gameStats from localStorage
        let storedStats = loadFromStorage('gameStats');
        if (storedStats.length === 0 && initialGameStats) {
            storedStats = initialGameStats;
        }

        // Generate a unique gameNumber
        const generateGameNumber = () => {
            const now = new Date();
            return `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${now.getFullYear()}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        };

        // Ensure all existing games have a valid gameNumber
        storedStats = storedStats.map(game => ({
            ...game,
            gameNumber: game.gameNumber || generateGameNumber(),
        }));

        // Only update gameStats when a game is complete
        if (turnLog.length > 0 && (!storedStats[storedStats.length - 1] || storedStats[storedStats.length - 1].turnLog !== turnLog)) {
            const lastTurn = turnLog[turnLog.length - 1];
            if (lastTurn && lastTurn.isGameEnd) {
                const newGame = {
                    gameNumber: lastTurn.gameNumber,
                    totalScore: turnLog.reduce((sum, turn) => sum + (turn.score || 0), 0),
                    scores: turnLog.reduce((acc, turn) => ({ ...acc, [turn.category]: turn.score }), {}),
                    timestamp: new Date().toISOString(),
                };
                storedStats = [...storedStats, newGame];
            }
        }

        // Calculate summary stats
        if (storedStats.length > 0) {
            const gamesPlayed = storedStats.length;
            const scores = storedStats.map((game) => game.totalScore);
            const lowestScore = Math.min(...scores);
            const highestScore = Math.max(...scores);
            const averageScore = scores.reduce((sum, score) => sum + score, 0) / gamesPlayed;

            setSummaryStats({
                gamesPlayed,
                lowestScore: lowestScore === Infinity ? 0 : lowestScore,
                highestScore: highestScore === -Infinity ? 0 : highestScore,
                averageScore: Number(averageScore.toFixed(2)),
            });
        }
    }, [refreshKey, initialGameStats, initialTurnLog]);

    const categoryOrder = [
        'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeOfAKind', 'fourOfAKind', 'fullHouse',
        'smallStraight', 'largeStraight', 'yahtzee', 'chance'
    ];

    const chartData = useMemo(() => {
        const storedStats = loadFromStorage('gameStats');
        if (!storedStats || storedStats.length === 0 || !turnLog || turnLog.length === 0) {
            return null;
        }

        // Calculate total scores for line chart
        const totalScores = storedStats.map((game) => game.totalScore);
        const meanScore = totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length;
        const totalScoresData = {
            labels: storedStats.map((game) => `Game ${game.gameNumber}`),
            datasets: [
                {
                    label: 'Total Score',
                    data: totalScores,
                    borderColor: '#2563eb',
                    backgroundColor: '#2563eb',
                    fill: false,
                    tension: 0.1,
                },
                {
                    label: 'Mean Score',
                    data: Array(totalScores.length).fill(meanScore),
                    borderColor: '#EF4444', // Red to distinguish from main line
                    backgroundColor: '#EF4444',
                    borderDash: [2, 2], // Dashed line for mean
                    pointRadius: 0, // No points on mean line
                    fill: false,
                },
            ],
        };

        // Calculate average scores
        const categories = [...new Set(
            storedStats.flatMap(game => Object.keys(game.scores || {}))
        )].sort((a, b) => {
            const indexA = categoryOrder.indexOf(a);
            const indexB = categoryOrder.indexOf(b);
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });

        const avgScores = categories.map((cat) => {
            const total = storedStats.reduce((sum, game) => sum + (game.scores[cat] || 0), 0);
            return total / storedStats.length || 0;
        });
        const avgScoresData = {
            labels: categories.map(prettyName),
            datasets: [
                {
                    label: 'Average Score',
                    data: avgScores,
                    backgroundColor: [
                        '#10B981', // emerald
                        '#3B82F6', // blue
                        '#F59E0B', // amber
                        '#EF4444', // red
                        '#8B5CF6', // violet
                        '#22D3EE', // cyan
                        '#F472B6', // pink
                        '#6366F1', // indigo
                        '#84CC16', // lime
                        '#EC4899', // fuchsia
                        '#0EA5E9', // sky
                        '#A855F7', // purple
                        '#D946EF', // magenta
                    ],
                    hoverBackgroundColor: [
                        '#0e9e6f', // emerald - darker
                        '#2563eb', // blue - darker
                        '#d97706', // amber - darker
                        '#dc2626', // red - darker
                        '#7c3aed', // violet - darker
                        '#06b6d4', // cyan - darker
                        '#ec4899', // pink - darker
                        '#4f46e5', // indigo - darker
                        '#65a30d', // lime - darker
                        '#db2777', // fuchsia - darker
                        '#0284c7', // sky - darker
                        '#9333ea', // purple - darker
                        '#c026d3', // magenta - darker
                    ],
                    borderColor: '#1F2937',
                    borderWidth: 1,
                    borderRadius: 4,
                },
            ],
        };

        // Calculate die frequency
        const dieFrequency = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        turnLog.forEach((turn) => {
            if (Array.isArray(turn.dice)) {
                turn.dice.forEach((die) => {
                    if (die !== null && die >= 1 && die <= 6) {
                        dieFrequency[die] += 1;
                    }
                });
            }
        });

        const dieFrequencyData = {
            labels: ['1s', '2s', '3s', '4s', '5s', '6s'],
            datasets: [
                {
                    label: 'Rolled Dice',
                    data: [dieFrequency[1], dieFrequency[2], dieFrequency[3], dieFrequency[4], dieFrequency[5], dieFrequency[6]],
                    backgroundColor: [
                        '#10B981', // emerald
                        '#3B82F6', // blue
                        '#F59E0B', // amber
                        '#EF4444', // red
                        '#8B5CF6', // violet
                        '#22D3EE', // cyan
                    ],
                    borderColor: '#1F2937',
                    borderWidth: 1,
                },
            ],
        };

        // Calculate zero-score frequency
        const zeroScores = categories.map(category => {
            return storedStats.reduce((count, game) => {
                const score = game.scores?.[category];
                return count + (score === 0 || score === undefined ? 1 : 0);
            }, 0);
        });
        const zeroScoresData = {
            labels: categories.map(prettyName),
            datasets: [
                {
                    label: 'Zero Scores',
                    data: zeroScores,
                    backgroundColor: '#EF4444', // Red for zero scores
                    borderColor: '#b91c1c',
                    borderWidth: 1,
                    borderRadius: 4,
                },
            ],
        };

        return { totalScoresData, avgScoresData, dieFrequencyData, zeroScoresData };
    }, [turnLog]);

    if (!chartData) {
        return (
            <div key={refreshKey} className="mb-4 border border-gray-200 bg-white shadow-sm rounded-t-2xl rounded-b-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 shadow-md flex justify-between items-center rounded-t-2xl">
                    <h3 className="text-1xl font-semibold tracking-tight">📊 Game Statistics</h3>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-gray-500">No games or turns recorded for statistics.</div>
            </div>
        );
    }

    return (
        <div className="mb-4 border border-gray-200 bg-white shadow-sm rounded-t-2xl rounded-b-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 shadow-md flex justify-between items-center rounded-t-2xl">
                <h3 className="text-1xl font-semibold tracking-tight">📊 Game Statistics</h3>
            </div>
            <div className="bg-gray-50 px-4 py-3 space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Game Summary Statistics</h3>
                    <div className="space-y-2">
                        <div className="flex justify-around items-center text-6xl font-bold text-gray-800">
                            <div className="flex-1 text-center">
                                {summaryStats.gamesPlayed}
                            </div>
                            <div className="flex-1 text-center">
                                {summaryStats.lowestScore}
                            </div>
                            <div className="flex-1 text-center">
                                {summaryStats.highestScore}
                            </div>
                            <div className="flex-1 text-center">
                                {summaryStats.averageScore}
                            </div>
                        </div>
                        <div className="flex justify-around items-center text-sm text-gray-600">
                            <div className="flex-1 text-center">
                                Games Played
                            </div>
                            <div className="flex-1 text-center">
                                Lowest Score
                            </div>
                            <div className="flex-1 text-center">
                                Highest Score
                            </div>
                            <div className="flex-1 text-center">
                                Average Score
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="w-full bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Total Scores Over Games</h3>
                        <div className="w-full h-[250px]">
                            <Line
                                data={chartData.totalScoresData}
                                options={{
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
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[300px]">
                        <div className="w-full bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Average Score Per Category</h3>
                            <div className="w-full h-[250px]">
                                <Bar
                                    data={chartData.avgScoresData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: { title: { display: false, text: 'Category' } },
                                            y: { title: { display: true, text: 'Average Score' }, beginAtZero: true },
                                        },
                                        plugins: { legend: { display: false } },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-[300px]">
                        <div className="w-full bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Die Distribution</h3>
                            <div className="w-full h-[250px]">
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
                                            datalabels: {
                                                color: '#111827',
                                                font: { weight: 'bold', size: 13 },
                                                formatter: (value, context) => {
                                                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                                    const percentage = ((value / total) * 100).toFixed(1) + '%';
                                                    return `${value} (${percentage})`;
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-[300px]">
                        <div className="w-full bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc]">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Zero Score Frequency</h3>
                            <div className="w-full h-[250px]">
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
            </div>
        </div>
    );
}