// components/ScoreCardLayout.jsx

import DiceField from './DiceField';
import ScoreCardSection from './ScoreCardSection';
import SectionTotals from './SectionTotals';
import SuggestionsPanel from './SuggestionsPanel';

export default function ScoreCardLayout({
    upperCategories,
    lowerCategories,
    scores,
    suggestedScores,
    applyScore,
    rollCount,
    turnComplete,
    prettyName,
    earnedBonuses,
    upperSubtotal,
    bonus,
    upperTotal,
    lowerTotal,
    grandTotal,
    dice,
    rollDice,
    toggleHold,
    suggestions,
}) {


    return (
        <div className="flex flex-col items-center p-4 bg-white min-h-screen">

            <div className="flex flex-row justify-center items-start gap-8">

                {/* Upper Section */}
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
                            <SectionTotals
                                upperSubtotal={upperSubtotal}
                                bonus={bonus}
                                upperTotal={upperTotal}
                            />
                        }
                    />
                </div>

                {/* Dice & Suggestions */}
                <div className="flex flex-col items-center gap-4">
                    <DiceField
                        dice={dice}
                        rollDice={rollDice}
                        toggleHold={toggleHold}
                        rollCount={rollCount}
                    />
                    <SuggestionsPanel suggestions={suggestions} />
                </div>

                {/* Lower Section */}
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
                            <SectionTotals
                                lowerTotal={lowerTotal}
                                grandTotal={grandTotal}
                            />
                        }
                    />
                </div>
            </div>
        </div>
    );
}
