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

export default function GameStatsPanel({ gameStats, turnLog, refreshKey }) {
    const [summaryStats, setSummaryStats] = useState({
        gamesPlayed: 0,
        lowestScore: Infinity,
        highestScore: -Infinity,
        averageScore: 0,
    });

    useEffect(() => {
        const storedStats = JSON.parse(localStorage.getItem('gameStats') || '[]');
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
    }, [refreshKey]);

    const chartData = useMemo(() => {
        if (!gameStats || gameStats.length === 0 || !turnLog || turnLog.length === 0) {
            return null;
        }

        console.log('[GameStatsPanel] turnLog:', turnLog);

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
        turnLog.forEach((turn) => {
            turn.dice.forEach((die) => {
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
                    data: [dieFrequency[1], dieFrequency[2], dieFrequency[3], dieFrequency[4], dieFrequency[5], dieFrequency[6]],
                    backgroundColor: ['#2563eb', '#10b981', '#6366f1', '#f59e0b', '#6b7280', '#ef4444'],
                    borderColor: ['#2563eb', '#10b981', '#6366f1', '#f59e0b', '#6b7280', '#ef4444'],
                    borderWidth: 2,
                },
            ],
        };

        return { totalScoresData, avgScoresData, dieFrequencyData };
    }, [gameStats, turnLog]);

    if (!chartData) {
        return (
            <div key={refreshKey} className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">Game Statistics</div>
                <div className="bg-gray-50 px-4 py-3 text-gray-500">No games or turns recorded for statistics.</div>
            </div>
        );
    }

    return (
        <div key={refreshKey} className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm animate-[flash_0.5s_ease-out]">
            <style>{`
        @keyframes flash {
          0% { background-color: #f0fdf4; }
          100% { background-color: #ffffff; }
        }
      `}</style>
            <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">Game Statistics</div>
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
                                plugins: { legend: { display: false } },
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[300px]">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Average Score per Category</h3>
                        <div className="h-64">
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
                    <div className="flex-1 min-w-[300px]">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Die Frequency</h3>
                        <div className="h-64">
                            <Pie
                                data={chartData.dieFrequencyData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'bottom',
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
            </div>
        </div>
    );
}