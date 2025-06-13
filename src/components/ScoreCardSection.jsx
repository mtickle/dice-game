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
    earnedBonuses,
    totalsNode = null,
}) {
    return (
        <div className="space-y-2">
            {categories.map((key) => (
                <ScoreRow
                    key={key}
                    category={key}
                    label={prettyName(key)}
                    score={scores[key]}
                    onClick={() => applyScore(key)}
                    clickable={scores[key] === null && rollCount > 0 && !turnComplete}
                    bonusBadge={earnedBonuses?.[key]}
                    suggested={suggestedScores?.[key]} // THIS IS THE FIX
                    isUpperSection={isUpperSection}
                />
            ))}

            {totalsNode && (
                <div className="mt-2">
                    {totalsNode}
                </div>
            )}
        </div>
    );
}
