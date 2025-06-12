import ScoreCardSection from './ScoreCardSection';
import UnifiedSectionTotals from './UnifiedSectionTotals';

export default function ScoreCardLayout({
    upperCategories,
    lowerCategories,
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
}) {
    return (
        <div className="flex flex-col md:flex-row gap-6 p-4 bg-white border border-gray-300 rounded-lg">
            {/* Upper Section */}
            <div className="flex-1">
                <h2 className="text-lg font-bold mb-2 text-gray-800">Upper Section</h2>
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
                        <UnifiedSectionTotals
                            upperSubtotal={upperSubtotal}
                            bonus={bonus}
                            upperTotal={upperTotal}
                        />
                    }
                />
            </div>

            {/* Lower Section */}
            <div className="flex-1">
                <h2 className="text-lg font-bold mb-2 text-gray-800">Lower Section</h2>
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
                        <UnifiedSectionTotals
                            lowerTotal={lowerTotal}
                            grandTotal={grandTotal}
                        />
                    }
                />
            </div>
        </div>
    );
}
