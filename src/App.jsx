import { useAuth0 } from '@auth0/auth0-react';
import GameHistoryGridPanel from '@components/GameHistoryGridPanel';
import GameStatsPanel from '@components/GameStatsPanel';
import ScoreCardLayout from '@components/ScoreCardLayout';
import TurnLogPanel from '@components/TurnLogPanel';
import { useGameLogic } from '@hooks/useGameLogic';
import { loadFromStorage, saveToStorage } from '@utils/storageUtils';
import { generateGameNumber } from '@utils/utils';
import { useCallback, useEffect, useState } from 'react';

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  const [gameLog, setGameLog] = useState([]);
  const [turnLog, setTurnLog] = useState(() => {
    try {
      const saved = loadFromStorage('turnLog');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.filter(turn => typeof turn.gameNumber === 'string' && turn.gameNumber.match(/^\d{12}$/));
    } catch (error) {
      console.error('[App] Error loading turnLog:', error);
      return [];
    }
  });
  const [gameStats, setGameStats] = useState(() => {
    try {
      const saved = loadFromStorage('gameStats');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.filter(game => typeof game.gameNumber === 'string' && game.gameNumber.match(/^\d{12}$/));
    } catch (error) {
      console.error('[App] Error loading gameStats:', error);
      return [];
    }
  });
  const [showAllTurns, setShowAllTurns] = useState(false);
  const [gameNumber, setGameNumber] = useState(generateGameNumber());

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
    }
  }, [isGameOver]);

  return (
    <div className="container mx-auto p-4">
      {/* New div to display game number */}
      <div className="mb-4 p-2 bg-gray-100 rounded-lg text-gray-800 text-center shadow-sm">
        Game Number {gameNumber} in progress ...
      </div>

      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
          </button>
        </>
      ) : (
        <button onClick={loginWithRedirect}>Log In</button>
      )}

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
      />
      <GameHistoryGridPanel gameStats={gameStats} refreshKey={gameCount} />
      <GameStatsPanel gameStats={gameStats} turnLog={turnLog} />

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