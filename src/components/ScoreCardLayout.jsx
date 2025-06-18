import { lowerCategories, prettyName, upperCategories } from '../utils/utils';
import AdvicePanel from './AdvicePanel';
import AutoPlayer from './AutoPlayer';
import DiceField from './DiceField';
import ScoreCardSection from './ScoreCardSection';

function UpperSectionTotals({ upperSubtotal, bonus, upperTotal }) {
    return (
        <div className="text-gray-800 font-semibold">
            <div>Subtotal: {upperSubtotal}</div>
            <div>Bonus: {bonus}</div>
            <div>Total: {upperTotal}</div>
        </div>
    );
}

function LowerSectionTotals({ lowerTotal, grandTotal }) {
    return (
        <div className="text-gray-800 font-semibold">
            <div>Lower Total: {lowerTotal}</div>
            <div>Grand Total: {grandTotal}</div>
        </div>
    );
}

export default function ScoreCardLayout({
    scores,
    totals,
    suggestedScores,
    applyScore,
    rollCount,
    turnComplete,
    earnedBonuses,
    dice,
    rollDice,
    toggleHold,
    autoPlaying,
    setAutoPlaying,
    autoplayTurn,
    suggestions,
    gameStats,
}) {
    //console.log('[ScoreCardLayout] dice:', dice);
    //console.log('[ScoreCardLayout] upperCategories:', upperCategories);

    return (
        <div className="flex justify-between p-4 bg-white rounded-lg shadow-sm gap-4">
            <div className="w-[300px]">
                <ScoreCardSection
                    categories={upperCategories}
                    scores={scores}
                    suggestedScores={suggestedScores}
                    applyScore={applyScore}
                    rollCount={rollCount}
                    turnComplete={turnComplete}
                    prettyName={prettyName}
                    isUpperSection={true}
                    earnedBonuses={earnedBonuses}
                    totalsNode={
                        <UpperSectionTotals
                            upperSubtotal={totals.upperSubtotal}
                            bonus={totals.bonus}
                            upperTotal={totals.upperTotal}
                        />
                    }
                />
            </div>
            <div className="flex flex-col items-center gap-4">
                <DiceField dice={dice} rollDice={rollDice} toggleHold={toggleHold} rollCount={rollCount} />
                <AutoPlayer
                    rollDice={rollDice}
                    applyScore={applyScore}
                    rollCount={rollCount}
                    turnComplete={turnComplete}
                    isGameOver={totals.isGameOver}
                    suggestedScores={suggestedScores}
                    scores={scores}
                    gameCount={totals.gameCount}
                    autoPlaying={autoPlaying}
                    setAutoPlaying={setAutoPlaying}
                    autoplayTurn={autoplayTurn}
                    totals={totals}
                />
                <AdvicePanel
                    strategy={suggestions}
                    rollCount={rollCount}
                    suggestedScores={suggestedScores}
                    prettyName={prettyName}
                />

            </div>
            <div className="w-[300px]">
                <ScoreCardSection
                    categories={lowerCategories}
                    scores={scores}
                    suggestedScores={suggestedScores}
                    applyScore={applyScore}
                    rollCount={rollCount}
                    turnComplete={turnComplete}
                    prettyName={prettyName}
                    isUpperSection={false}
                    earnedBonuses={earnedBonuses}
                    totalsNode={
                        <LowerSectionTotals
                            lowerTotal={totals.lowerTotal}
                            grandTotal={totals.grandTotal}
                        />
                    }
                />
            </div>
        </div>
    );
}