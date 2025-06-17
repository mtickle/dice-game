import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import GameOverOverlay from './components/GameOverOverlay';
import Header from './components/Header';
import ScoreCardLayout from './components/ScoreCardLayout';
import { useGameLogic } from './hooks/useGameLogic';
import { lowerCategories, prettyName, upperCategories } from './utils/utils';

export default function App() {
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [gameCount, setGameCount] = useState(0);
  const [gameStats, setGameStats] = useState(() => {
    const saved = localStorage.getItem('gameStats');
    return saved ? JSON.parse(saved) : [];
  });
  const [turnResults, setTurnResults] = useState(() => {
    const saved = localStorage.getItem('turnResults');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    console.log('[App] gameCount =', gameCount);
  }, [gameCount]);

  useEffect(() => {
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  }, [gameStats]);
  useEffect(() => {
    localStorage.setItem('turnResults', JSON.stringify(turnResults));
  }, [turnResults]);

  const logGameStats = (stats) => {
    setGameStats(prev => [...prev, stats]);
    console.log('[App] Game stats saved:', stats);
  };

  const logTurnResult = (result) => {
    setTurnResults(prev => [...prev, result]);
    console.log('[App] Turn result saved:', result);
  };

  const clearStats = () => {
    setGameStats([]);
    setTurnResults([]);
    localStorage.removeItem('gameStats');
    localStorage.removeItem('turnResults');
    console.log('[App] Cleared all stats');
  };

  const {
    scores,
    dice,
    rollCount,
    turnComplete,
    rollDice,
    toggleHold,
    applyScore,
    suggestedScores,
    earnedBonuses,
    upperSubtotal,
    bonus,
    upperTotal,
    lowerTotal,
    grandTotal,
    adviceText,
    resetGame,
    isGameOver,
    lifetimeStats,
    turn
  } = useGameLogic(logTurnResult, gameCount + 1); // Pass gameCount + 1

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <Header />
      <button
        onClick={clearStats}
        className="px-4 py-2 bg-gray-500 text-white rounded-xl mt-2"
      >
        Clear Stats
      </button>
      <Dashboard />
      {isGameOver && !autoPlaying ? (
        <GameOverOverlay
          grandTotal={grandTotal}
          onRestart={resetGame}
        />
      ) : (
        <ScoreCardLayout
          upperCategories={upperCategories}
          lowerCategories={lowerCategories}
          scores={scores}
          suggestedScores={suggestedScores}
          applyScore={applyScore}
          rollCount={rollCount}
          turnComplete={turnComplete}
          prettyName={prettyName}
          earnedBonuses={earnedBonuses}
          upperSubtotal={upperSubtotal}
          bonus={bonus}
          upperTotal={upperTotal}
          lowerTotal={lowerTotal}
          grandTotal={grandTotal}
          dice={dice}
          rollDice={rollDice}
          toggleHold={toggleHold}
          suggestions={adviceText}
          lifetimeStats={lifetimeStats}
          isGameOver={isGameOver}
          resetGame={resetGame}
          autoPlaying={autoPlaying}
          setAutoPlaying={setAutoPlaying}
          logGameStats={logGameStats}
          gameCount={gameCount}
          setGameCount={setGameCount}
        />

      )}
    </div>
  );
}