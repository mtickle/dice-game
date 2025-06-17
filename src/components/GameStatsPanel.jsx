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
    Legend
);

export default function GameStatsPanel({ gameStats, refreshKey }) {
    // Memoize chart data
    const chartData = useMemo(() => {
        if (!gameStats || gameStats.length === 0) {
            return null;
        }

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

        // Upper Bonus Pie Chart
        const bonusCount = gameStats.reduce((count, game) => {
            const upperTotal = Object.keys(game.scores)
                .filter((cat) => ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].includes(cat))
                .reduce((sum, cat) => sum + (game.scores[cat] || 0), 0);
            return upperTotal >= 63 ? count + 1 : count;
        }, 0);
        const bonusData = {
            labels: ['Bonus Achieved', 'No Bonus'],
            datasets: [
                {
                    data: [bonusCount, gameStats.length - bonusCount],
                    backgroundColor: ['#f59e0b', '#ef4444'],
                    borderColor: ['#f59e0b', '#ef4444'],
                    borderWidth: 1,
                },
            ],
        };

        return { totalScoresData, avgScoresData, bonusData };
    }, [gameStats]);

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
                    No games recorded for statistics.
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
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Upper Section Bonus Frequency</h3>
                    <div className="h-64">
                        <Pie
                            data={chartData.bonusData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: true, position: 'top' },
                                    title: { display: true, text: 'Upper Section Bonus (63+ points)' },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}