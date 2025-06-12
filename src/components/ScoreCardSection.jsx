import { getPrettyName } from '../utils/utils';
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
    totalsNode = null,
    earnedBonuses,
}) {
    return (
        <div className="flex flex-col gap-2 bg-white p-3 rounded border border-gray-300">
            {categories.map((key) => (
                <ScoreRow
                    key={key}
                    category={key}
                    label={getPrettyName(key)}
                    score={scores[key]}
                    onClick={applyScore}
                    clickable={scores[key] === null && rollCount > 0 && !turnComplete}
                    bonusBadge={earnedBonuses?.[key]}
                    suggested={suggestedScores?.[key]}
                    isUpperSection={isUpperSection}
                />
            ))}

            {totalsNode && (
                <div className="mt-3">
                    {totalsNode}
                </div>
            )}
        </div>
    );
}
