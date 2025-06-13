// components/ScoreRow.jsx

import { useScoreAnimation } from '../hooks/useScoreAnimation';
import { iconLibrary } from '../icons/icons';

export default function ScoreRow({
    category,
    label,
    score,
    onClick,
    clickable,
    bonusBadge,
    suggested,
    isUpperSection,
}) {
    const isAnimating = useScoreAnimation(score);
    const Icon = iconLibrary[category];
    const showSuggested = score === null && suggested !== undefined;

    const containerClass = [
        'flex justify-between items-center',
        'p-2 mb-1 rounded',
        clickable ? 'cursor-pointer hover:bg-gray-100' : '',
        suggested ? 'border border-indigo-400 bg-indigo-50' : 'border border-gray-300',
        score !== null ? 'bg-white text-gray-400' : '',
    ].join(' ');

    return (
        <div
            className={containerClass}
            onClick={clickable ? () => onClick(category) : undefined}
        >
            <div className="flex items-center space-x-2 text-base font-semibold text-black">
                {isUpperSection && Icon && (
                    <Icon size={20} className="text-gray-500" aria-hidden="true" />
                )}
                <span>{label}</span>
                {bonusBadge && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                        +10
                    </span>
                )}
            </div>

            <div className={`text-lg font-mono ${isAnimating ? 'text-green-600' : 'text-gray-700'}`}>
                {score !== null
                    ? score
                    : showSuggested && typeof suggested === 'number' && !isNaN(suggested)
                        ? suggested
                        : ''}
            </div>
        </div>
    );
}
