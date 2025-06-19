import GameHistoryPanel from '@components/GameHistoryPanel';
import GameStatsPanel from '@components/GameStatsPanel';
import ScoreCardLayout from '@components/ScoreCardLayout';
import { useGameLogic } from '@hooks/useGameLogic';
import { useCallback, useEffect, useState } from 'react';
import TurnLogPanel from './components/TurnLogPanel';

function App() {
  const [gameLog, setGameLog] = useState([]);
  const [turnLog, setTurnLog] = useState(() => {
    try {
      const saved = localStorage.getItem('turnLog');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('[App] Error loading turnLog:', error);
      return [];
    }
  });
  const [gameStats, setGameStats] = useState(() => {
    try {
      const saved = localStorage.getItem('gameStats');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('[App] Error loading gameStats:', error);
      return [];
    }
  });
  const [showAllTurns, setShowAllTurns] = useState(false);

  const logTurnResult = useCallback((result) => {
    setGameLog((prev) => [...prev, result]);
    setTurnLog((prev) => {
      const newLog = [...prev, result];
      try {
        localStorage.setItem('turnLog', JSON.stringify(newLog));
      } catch (error) {
        console.error('[App] Error saving turnLog:', error);
      }
      return newLog;
    });
  }, []);

  const logGameStats = useCallback((stats) => {
    setGameStats((prev) => {
      const newStats = [...prev, stats];
      try {
        localStorage.setItem('gameStats', JSON.stringify(newStats));
      } catch (error) {
        console.error('[App] Error saving gameStats:', error);
      }
      return newStats;
    });
  }, []);

  const {
    gameCount,
    isGameOver,
    scores,
    dice,
    rollCount,
    turnComplete,
    suggestedScores,
    rollDice,
    applyScore,
    resetGame,
    autoplayTurn,
    toggleHold,
    adviceText,
    earnedBonuses,
    ...totals
  } = useGameLogic(logTurnResult, logGameStats);

  const [autoPlaying, setAutoPlaying] = useState(false);

  useEffect(() => {
    if (isGameOver) {
      setGameLog([]);
    }
  }, [isGameOver]);

  const exportData = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    exportData(turnLog, `yahtzee_turnLog_${new Date().toISOString()}.json`);
    exportData(gameStats, `yahtzee_gameStats_${new Date().toISOString()}.json`);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all turn and game data? This cannot be undone.')) {
      setTurnLog([]);
      setGameStats([]);
      setGameLog([]);
      try {
        localStorage.setItem('turnLog', JSON.stringify([]));
        localStorage.setItem('gameStats', JSON.stringify([]));
      } catch (error) {
        console.error('[App] Error resetting data:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* <div className="flex justify-end mb-4 gap-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          onClick={handleExport}
        >
          Export Game Data
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          onClick={handleResetData}
        >
          Reset All Data
        </button>
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
          onClick={() => setShowAllTurns(!showAllTurns)}
        >
          {showAllTurns ? 'Show Current Game' : 'Show All Turns'}
        </button>
      </div> */}

      <ScoreCardLayout
        scores={scores}
        totals={totals}
        suggestedScores={suggestedScores}
        applyScore={applyScore}
        rollCount={rollCount}
        turnComplete={turnComplete}
        earnedBonuses={earnedBonuses}
        dice={dice}
        rollDice={rollDice}
        toggleHold={toggleHold}
        autoPlaying={autoPlaying}
        setAutoPlaying={setAutoPlaying}
        autoplayTurn={autoplayTurn}
        suggestions={adviceText}
        gameStats={gameStats}
      />

      <GameHistoryPanel gameStats={gameStats} refreshKey={gameCount} />
      <GameStatsPanel gameStats={gameStats} />
      <TurnLogPanel
        gameLog={showAllTurns ? turnLog : gameLog}
        turnLog={turnLog}
        gameNumber={gameCount}
        showAllTurns={showAllTurns}
      />
    </div>
  );
}

export default App;