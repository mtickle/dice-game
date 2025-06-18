import GameHistoryPanel from '@components/GameHistoryPanel';
import GameLogPanel from '@components/GameLogPanel';
import GameStatsPanel from '@components/GameStatsPanel';
import ScoreCardLayout from '@components/ScoreCardLayout';
import { useGameLogic } from '@hooks/useGameLogic';
import { useCallback, useEffect, useState } from 'react';

function App() {
  const [gameLog, setGameLog] = useState([]);
  const [gameStats, setGameStats] = useState([]);

  const logTurnResult = useCallback((result) => {
    console.log('[App] Turn result saved:', result);
    setGameLog((prev) => [...prev, result]);
  }, []);

  const logGameStats = useCallback((stats) => {
    console.log('[App] Game stats saved:', stats);
    setGameStats((prev) => [...prev, stats]);
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

  console.log('[App] dice:', dice);

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
        gameStats={gameStats}
      />
      <GameStatsPanel gameStats={gameStats} />
      <GameHistoryPanel gameStats={gameStats} />
      <GameLogPanel gameLog={gameLog} />


    </div>
  );
}

export default App;