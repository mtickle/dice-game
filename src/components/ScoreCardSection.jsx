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

    if (!categories || !Array.isArray(categories)) {
        return (
            <div className="bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc] text-red-500">
                Error: Categories not loaded for {isUpperSection ? 'Upper' : 'Lower'} section.
            </div>
        );
    }

    return (
        <div className="scorecard-section bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc]">
            {categories.map((key) => (
                <ScoreRow
                    key={key}
                    category={key}
                    label={prettyName(key)}
                    score={scores[key]}
                    onClick={() => applyScore(key)}
                    clickable={scores[key] === null && rollCount > 0 && !turnComplete}
                    bonusBadge={earnedBonuses?.[key]}
                    suggested={suggestedScores?.[key]}
                    isUpperSection={isUpperSection}
                />
            ))}
            {totalsNode && <div className="mt-2">{totalsNode}</div>}
        </div>
    );
}