import { lowerCategories, prettyName, upperCategories } from '../utils/utils';
import AdvicePanel from './AdvicePanel';
import AutoPlayer from './AutoPlayer';
import DiceField from './DiceField';
import ScoreCardSection from './ScoreCardSection';

function UpperSectionTotals({ upperSubtotal, bonus, upperTotal }) {
    return (
        <div className="text-gray-800 font-semibold">
            <div>Subtotal: {upperSubtotal || 0}</div>
            <div>Bonus: {bonus || 0}</div>
            <div>Total: {upperTotal || 0}</div>
        </div>
    );
}

function LowerSectionTotals({ lowerTotal, grandTotal }) {
    return (
        <div className="text-gray-800 font-semibold">
            <div>Lower Total: {lowerTotal || 0}</div>
            <div>Grand Total: {grandTotal || 0}</div>
        </div>
    );
}

export default function ScoreCardLayout({
    scores,
    totals = { upperSubtotal: 0, bonus: 0, upperTotal: 0, lowerTotal: 0, grandTotal: 0, isGameOver: false, gameCount: 1 },
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
    setGameStats,
    gameStats,
    setTurnLog,
    turnLog,
    showAllTurns,
    setShowAllTurns,
    isGameOver,
    gameCount,
}) {
    return (
        <div className="flex justify-between p-6 bg-white rounded-lg shadow-sm gap-4 mb-4">
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
                    isGameOver={isGameOver || totals.isGameOver} // Fallback to totals if top-level missing
                    suggestedScores={suggestedScores}
                    scores={scores}
                    gameCount={gameCount || totals.gameCount} // Fallback to totals if top-level missing
                    autoPlaying={autoPlaying}
                    setAutoPlaying={setAutoPlaying}
                    autoplayTurn={autoplayTurn}
                    totals={totals}
                    setTurnLog={setTurnLog}
                    turnLog={turnLog}
                    setGameStats={setGameStats}
                    gameStats={gameStats}
                    showAllTurns={showAllTurns}
                    setShowAllTurns={setShowAllTurns}
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