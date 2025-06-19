import GameHistoryPanel from '@components/GameHistoryPanel';
import GameStatsPanel from '@components/GameStatsPanel';
import ScoreCardLayout from '@components/ScoreCardLayout';
import TurnLogPanel from '@components/TurnLogPanel';
import { useGameLogic } from '@hooks/useGameLogic';
import { useCallback, useEffect, useState } from 'react';

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

  return (
    <div className="container mx-auto p-4">

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
        gameStats={setGameStats}
        setGameStats={setGameStats}
        setTurnLog={setTurnLog}
        setGameLog={setGameLog}
        resetGame={resetGame}
      />

      <GameStatsPanel gameStats={gameStats} />
      <GameHistoryPanel gameStats={gameStats} refreshKey={gameCount} />

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