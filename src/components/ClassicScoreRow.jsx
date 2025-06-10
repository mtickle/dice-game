
import { iconMap, prettyName } from '../utils/utils';

export default function ClassicScoreRow({ category, score, suggested, onClick }) {
    const isScored = score !== null;
    const isSuggested = suggested !== undefined;

    return (
        <div
            className={`classic-score-row ${isScored ? 'scored' : ''} ${isSuggested ? 'suggested' : ''}`}
            onClick={!isScored ? onClick : undefined}
        >
            <span className="label">
                {iconMap[category]} {prettyName(category)}
            </span>
            <span className="value">{isScored ? score : isSuggested ? suggested : ''}</span>
        </div>
    );
}
