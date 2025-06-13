import Header from './components/Header';
import ScoreCardLayout from './components/ScoreCardLayout';
import useGameLogic from './hooks/useGameLogic';
import { lowerCategories, prettyName, upperCategories } from './utils/utils';

export default function App() {
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
  } = useGameLogic();

  return (

    <div className="min-h-screen bg-yellow-50 flex flex-col items-center p-4">
      <Header />

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
      />
    </div>
  );
}
