import ScoreCardLayout from './components/ScoreCardLayout';
import { useGameLogic } from './hooks/useGameLogic';

export default function App() {
  const {
    dice,
    rollDice,
    toggleHold,
    scores,
    suggestedScores,
    applyScore,
    rollCount,
    turnComplete,
    prettyName,
    upperSubtotal,
    bonus,
    upperTotal,
    lowerTotal,
    grandTotal,
    earnedBonuses,
    gameAdvice
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">🎲 Dice Breaker</h1>

      <ScoreCardLayout
        dice={dice}
        rollDice={rollDice}
        toggleHold={toggleHold}
        scores={scores}
        suggestedScores={suggestedScores}
        applyScore={applyScore}
        rollCount={rollCount}
        turnComplete={turnComplete}
        prettyName={prettyName}
        upperSubtotal={upperSubtotal}
        bonus={bonus}
        upperTotal={upperTotal}
        lowerTotal={lowerTotal}
        grandTotal={grandTotal}
        earnedBonuses={earnedBonuses}
        gameAdvice={gameAdvice}
      />
    </div>
  );
}
