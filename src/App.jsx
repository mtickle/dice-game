import AutoPlayer from '@components/AutoPlayer';
import GameHistoryPanel from '@components/GameHistoryPanel';
import GameLogPanel from '@components/GameLogPanel';
import GameStatsPanel from '@components/GameStatsPanel';
import ScoreCardLayout from '@components/ScoreCardLayout';
//import useGameLogic from '@hooks/useGameLogic';
import { useGameLogic } from '@hooks/useGameLogic';

import { useCallback, useEffect, useState } from 'react';

function App() {
  const [gameLog, setGameLog] = useState([]);
  const [gameStats, setGameStats] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const logTurnResult = useCallback((result) => {
    console.log('[App] Turn result saved:', result);
    setGameLog((prev) => [...prev, result]);
  }, []);

  const logGameStats = useCallback((stats) => {
    console.log('[App] Game stats saved:', stats);
    setGameStats((prev) => [...prev, stats]);
  }, []);

  const { gameCount, isGameOver, scores, dice, rollCount, turnComplete, suggestedScores, rollDice, applyScore, resetGame, autoplayTurn, ...totals } = useGameLogic(logTurnResult, logGameStats);

  const [autoPlaying, setAutoPlaying] = useState(false);

  // Clear gameLog and trigger GameStatsPanel refresh when game ends
  useEffect(() => {
    if (isGameOver) {
      setGameLog([]);
      setRefreshKey((prev) => prev + 1);
      // Reset refreshKey after a delay to allow future refreshes
      setTimeout(() => setRefreshKey((prev) => prev + 1), 500);
    }
  }, [isGameOver]);

  return (
    <div className="container mx-auto p-4">
      <ScoreCardLayout scores={scores} totals={totals} />
      <AutoPlayer
        rollDice={rollDice}
        applyScore={applyScore}
        rollCount={rollCount}
        turnComplete={turnComplete}
        isGameOver={isGameOver}
        suggestedScores={suggestedScores}
        scores={scores}
        gameCount={gameCount}
        autoPlaying={autoPlaying}
        setAutoPlaying={setAutoPlaying}
        autoplayTurn={autoplayTurn}
      />
      <GameLogPanel gameLog={gameLog} />
      <GameHistoryPanel gameStats={gameStats} />
      <GameStatsPanel gameStats={gameStats} refreshKey={refreshKey} />
    </div>
  );
}

export default App;