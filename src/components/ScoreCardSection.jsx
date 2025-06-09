import BonusProgressBar from './BonusProgressBar';
import UnifiedScoreRow from './UnifiedScoreRow';

export default function ScoreCardSection({
    categories,
    scores,
    suggestedScores,
    applyScore,
    rollCount,
    turnComplete,
    prettyName,
    isUpperSection,
    bonusCategory = null,
    upperSubtotal = 0,
    bonus = 0,
    upperTotal = 0,
    totalsNode = null
}) {

    return (
        <div className="scorecard-section mb-2">
            {categories.map((key) => (

                <UnifiedScoreRow
                    key={key}
                    category={key}
                    label={prettyName(key)}
                    score={scores[key]}
                    onClick={applyScore}
                    clickable={scores[key] === null && rollCount > 0 && !turnComplete}
                    bonusBadge={bonusCategory === key}
                    suggested={suggestedScores?.[key]}
                    isUpperSection={isUpperSection}
                />
            ))}

            {isUpperSection && (
                <div className="text-sm mt-2 space-y-2">
                    <BonusProgressBar upperTotal={upperTotal} />
                </div>
            )}

            {totalsNode && (
                <div className="mt-2">
                    {totalsNode}
                </div>
            )}

        </div>


    );
}
