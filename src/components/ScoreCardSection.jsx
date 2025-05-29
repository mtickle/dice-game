import ScoreRow from './ScoreRow';

import UnifiedSectionTotals from './UnifiedSectionTotals';

export default function ScoreCardSection({
    title,
    categories,
    scores,
    suggestedScores = {},
    applyScore,
    rollCount,
    turnComplete,
    prettyName,
    bonusCategory = null,
    totalsNode = null,
    grandTotal
}) {
    return (
        <div className="scorecard-section mb-2">
            {categories.map((key) => (
                <ScoreRow
                    key={key}
                    category={key}
                    label={prettyName(key)}
                    score={scores[key]}
                    onClick={applyScore}
                    clickable={scores[key] === null && rollCount > 0 && !turnComplete}
                    isBonus={bonusCategory === key}
                />
            ))}
            {grandTotal !== null && (
                <UnifiedSectionTotals
                    grandTotal={grandTotal}
                />
            )}

        </div>


    );
}
