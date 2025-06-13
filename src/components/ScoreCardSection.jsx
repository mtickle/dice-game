// components/ScoreCardSection.jsx

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
    earnedBonuses,
    totalsNode,
}) {
    return (
        <div className="space-y-1">
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

            {totalsNode && <div className="mt-2">{totalsNode}</div>}
        </div>
    );
}
