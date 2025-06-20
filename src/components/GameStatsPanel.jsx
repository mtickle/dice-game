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
import { useMemo } from 'react';
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

export default function GameStatsPanel({ gameStats, turnLog, refreshKey }) {
    // Memoize chart data
    const chartData = useMemo(() => {
        if (!gameStats || gameStats.length === 0 || !turnLog || turnLog.length === 0) {
            return null;
        }

        console.log('[GameStatsPanel] turnLog:', turnLog); // Debug log

        // Total Scores Line Chart
        const totalScoresData = {
            labels: gameStats.map((game) => `Game ${game.gameNumber}`),
            datasets: [
                {
                    label: 'Total Score',
                    data: gameStats.map((game) => game.totalScore),
                    borderColor: '#2563eb',
                    backgroundColor: '#2563eb',
                    fill: false,
                    tension: 0.1,
                },
            ],
        };

        // Average Scores Bar Chart
        const categories = Object.keys(gameStats[0].scores);
        const avgScores = categories.map((cat) => {
            const total = gameStats.reduce((sum, game) => sum + (game.scores[cat] || 0), 0);
            return total / gameStats.length;
        });
        const avgScoresData = {
            labels: categories.map(prettyName),
            datasets: [
                {
                    label: 'Average Score',
                    data: avgScores,
                    backgroundColor: '#10b981',
                    borderColor: '#10b981',
                    borderWidth: 1,
                },
            ],
        };

        // Die Frequency Bar Chart (Rolled Only)
        const dieFrequency = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

        turnLog.forEach(turn => {
            turn.dice.forEach(die => {
                if (die !== null && die >= 1 && die <= 6) {
                    dieFrequency[die] += 1;
                }
            });
        });

        const dieFrequencyData = {
            labels: ['1s', '2s', '3s', '4s', '5s', '6s'],
            datasets: [
                {
                    label: 'Rolled Dice',
                    data: [
                        dieFrequency[1],
                        dieFrequency[2],
                        dieFrequency[3],
                        dieFrequency[4],
                        dieFrequency[5],
                        dieFrequency[6],
                    ],
                    backgroundColor: [
                        '#2563eb', // blue
                        '#10b981', // emerald
                        '#6366f1', // indigo
                        '#f59e0b', // amber
                        '#6b7280', // gray
                        '#ef4444', // rose
                    ],
                    borderColor: [
                        '#2563eb',
                        '#10b981',
                        '#6366f1',
                        '#f59e0b',
                        '#6b7280',
                        '#ef4444',
                    ],
                    borderWidth: 2,
                },
            ],
        };

        return { totalScoresData, avgScoresData, dieFrequencyData };
    }, [gameStats, turnLog]);

    if (!chartData) {
        return (
            <div
                key={refreshKey}
                className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm"
            >
                <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">
                    Game Statistics
                </div>
                <div className="bg-gray-50 px-4 py-3 text-gray-500">
                    No games or turns recorded for statistics.
                </div>
            </div>
        );
    }

    return (
        <div
            key={refreshKey}
            className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm animate-[flash_0.5s_ease-out]"
        >
            <style>
                {`
          @keyframes flash {
            0% { background-color: #f0fdf4; }
            100% { background-color: #ffffff; }
          }
        `}
            </style>
            <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">
                Game Statistics
            </div>
            <div className="bg-gray-50 px-4 py-3 space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Total Scores Over Games</h3>
                    <div className="h-64">
                        <Line
                            data={chartData.totalScoresData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { title: { display: true, text: 'Game Number' } },
                                    y: { title: { display: true, text: 'Total Score' }, beginAtZero: true },
                                },
                                plugins: { legend: { display: true } },
                            }}
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Average Score per Category</h3>
                    <div className="h-64">
                        <Bar
                            data={chartData.avgScoresData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { title: { display: true, text: 'Category' } },
                                    y: { title: { display: true, text: 'Average Score' }, beginAtZero: true },
                                },
                                plugins: { legend: { display: true } },
                            }}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Die Frequency (Rolled vs Held)</h3>
                    <div className="h-64">
                        <Bar
                            data={chartData.dieFrequencyData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { title: { display: true, text: 'Die Values' } },
                                    y: { title: { display: true, text: 'Number of Occurrences' }, beginAtZero: true },
                                },
                                plugins: { legend: { display: false } },
                            }}
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Die Frequency (Pie Chart)</h3>
                    <div className="h-64">
                        <Pie
                            data={chartData.dieFrequencyData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'right',
                                        labels: {
                                            color: '#374151', // dark gray text for better contrast
                                            font: { size: 14 },
                                        },
                                    },
                                    datalabels: {
                                        color: '#111827', // almost-black text inside slices
                                        font: {
                                            weight: 'bold',
                                            size: 13,
                                        },
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
        </div>
    );
}