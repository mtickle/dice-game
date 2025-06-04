import BonusProgressBar from './BonusProgressBar';
import ScoreRow from './ScoreRow';

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
    upperTotal = 0,
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

        </div>


    );
}
