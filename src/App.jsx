import { useAuth0 } from '@auth0/auth0-react';
import GameStatsPanel from '@components/GameStatsPanel';
import ScoreCardLayout from '@components/ScoreCardLayout';
import TopNavBar from '@components/TopNavBar';
import TurnLogPanel from '@components/TurnLogPanel';
import { useGameLogic } from '@hooks/useGameLogic';
import { loadFromStorage, saveToStorage } from '@utils/storageUtils';
import { generateGameNumber } from '@utils/utils';
import { useCallback, useEffect, useState } from 'react';

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [showAllTurns, setShowAllTurns] = useState(false);
  const [gameNumber, setGameNumber] = useState(generateGameNumber());
  const [refreshKey, setRefreshKey] = useState(0);
  const [gameLog, setGameLog] = useState([]);

  const [turnLog, setTurnLog] = useState(() => {
    try {

      const saved = loadFromStorage('turnLog');
      return saved.filter(turn => typeof turn.gameNumber === 'string' && turn.gameNumber.match(/^\d{12}$/));
    } catch (error) {
      console.error('[App] Error loading turnLog:', error);
      return [];
    }
  });

  const [gameStats, setGameStats] = useState(() => {
    try {
      const saved = loadFromStorage('gameStats');
      //const parsed = saved ? JSON.parse(saved) : [];
      return saved.filter(game => typeof game.gameNumber === 'string' && game.gameNumber.match(/^\d{12}$/));
    } catch (error) {
      console.error('[App] Error loading gameStats:', error);
      return [];
    }
  });


  const logTurnResult = useCallback((result) => {


    const turnWithGameNumber = { ...result, gameNumber };
    setGameLog((prev) => [...prev, turnWithGameNumber]);
    setTurnLog((prev) => {
      const newLog = [...prev, turnWithGameNumber];
      try {
        saveToStorage('turnLog', newLog);
      } catch (error) {
        console.error('[App] Error saving turnLog:', error);
      }
      return newLog;
    });
  }, [gameNumber]);

  const logGameStats = useCallback((stats) => {
    const statsWithGameNumber = { ...stats, gameNumber };
    setGameStats((prev) => {
      const existingIndex = prev.findIndex(g => g.gameNumber === statsWithGameNumber.gameNumber);
      const newStats = existingIndex >= 0
        ? prev.map((g, i) => i === existingIndex ? statsWithGameNumber : g)
        : [...prev, statsWithGameNumber];
      try {
        saveToStorage('gameStats', newStats);
      } catch (error) {
        console.error('[App] Error saving gameStats:', error);
      }
      return newStats;
    });
  }, [gameNumber]);

  //console.log(user);

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
  } = useGameLogic(logTurnResult, logGameStats, gameNumber, setGameNumber);

  const [autoPlaying, setAutoPlaying] = useState(false);

  useEffect(() => {
    if (isGameOver) {
      setGameLog([]);
      setGameNumber(generateGameNumber()); // New gameNumber on game over
      setRefreshKey(prev => {
        const next = prev + 1;
        return next;
      });
    }
  }, [isGameOver]);


  return (
    <div className="container mx-auto p-4">

      <TopNavBar />

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
        setGameStats={setGameStats}
        setTurnLog={setTurnLog}
        turnLog={turnLog}
        showAllTurns={showAllTurns}
        setShowAllTurns={setShowAllTurns}
        isGameOver={isGameOver}
        gameCount={gameCount}
        resetGame={resetGame}
        gameNumber={gameNumber}
        setGameNumber={setGameNumber}
        user={user}
        setRefreshKey={setRefreshKey}
      />

      <GameStatsPanel gameStats={gameStats} turnLog={turnLog} setRefreshKey={setRefreshKey} />


      <TurnLogPanel
        gameLog={showAllTurns ? turnLog : gameLog}
        turnLog={turnLog}
        gameNumber={gameNumber}
        showAllTurns={showAllTurns}
      />
    </div>
  );
}

export default App;