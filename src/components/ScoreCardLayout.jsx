import { lowerCategories, prettyName, upperCategories } from '../utils/utils';
import AdvicePanel from './AdvicePanel';
import AutoPlayer from './AutoPlayer';
import DiceField from './DiceField';
import ScoreCardSection from './ScoreCardSection';

function UpperSectionTotals({ upperSubtotal, bonus, upperTotal }) {
    return (
        <div className="mt-4 rounded ">
            <div className="flex justify-between items-center px-3 py-2 border-b border-dashed">
                <div className="font-semibold text-gray-800">Subtotal:</div>
                <div className="flex items-center space-x-2">
                    <div>{upperSubtotal || 0}</div>
                </div>
            </div>
            <div className="flex justify-between items-center px-3 py-2 border-b border-dashed">
                <div className="font-semibold text-gray-800">Bonus:</div>
                <div className="flex items-center space-x-2">
                    {bonus > 0 && <div className="text-green-500 font-bold">+{bonus}</div>}
                    <div>{bonus || 0}</div>
                </div>
            </div>
            <div className="flex justify-between items-center px-3 py-2 border-b border-dashed">
                <div className="font-semibold text-gray-800">Total:</div>
                <div className="flex items-center space-x-2">
                    <div>{upperTotal || 0}</div>
                </div>
            </div>
        </div>
    );
}

function LowerSectionTotals({ lowerTotal, grandTotal }) {
    return (

        <div className="mt-4 rounded ">
            <div className="flex justify-between items-center px-3 py-2 border-b border-dashed">
                <div className="font-semibold text-gray-800">Lower Total:</div>
                <div className="flex items-center space-x-2">
                    <div>{lowerTotal || 0}</div>
                </div>
            </div>
            <div className="flex justify-between items-center px-3 py-2 border-b border-dashed">
                <div className="font-semibold text-gray-800">Grand Total:</div>
                <div className="flex items-center space-x-2">
                    <div>{grandTotal || 0}</div>
                </div>
            </div>
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
    resetGame   
}) {
    return (
        <div className="flex justify-between p-6 bg-white rounded-lg shadow-sm gap-4 mb-4">
            <div className="w-[400px]">
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
                    resetGame={resetGame}
                />
                {!autoPlaying && (
                    <AdvicePanel
                        strategy={suggestions}
                        rollCount={rollCount}
                        suggestedScores={suggestedScores}
                        prettyName={prettyName}
                    />
                )}
            </div>
            <div className="w-[400px]">
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