import ScoreRow from './ScoreRow';

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
}) {
    return (
        <div className="scorecard-section mb-4">
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
        </div>
    );
}
