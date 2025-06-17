import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [gameStats, setGameStats] = useState([]);
    const [turnResults, setTurnResults] = useState([]);

    useEffect(() => {
        const updateStats = () => {
            const games = JSON.parse(localStorage.getItem('gameStats') || '[]');
            const turns = JSON.parse(localStorage.getItem('turnResults') || '[]');
            setGameStats(games);
            setTurnResults(turns);
        };
        updateStats();
        const interval = setInterval(updateStats, 5000); // Refresh every 5s
        return () => clearInterval(interval);
    }, []);

    const avgScore = gameStats.length
        ? (gameStats.reduce((sum, g) => sum + g.totalScore, 0) / gameStats.length).toFixed(2)
        : 0;

    return (
        <div className="p-4">
            <h2 className="text-2xl">Dice Breaker Dashboard</h2>
            <p>Games Played: {gameStats.length}</p>
            <p>Average Score: {avgScore}</p>
            <p>Turns Recorded: {turnResults.length}</p>
        </div>
    );
}