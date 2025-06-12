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

    const containerClasses = [
        'flex justify-between items-center px-3 py-2 rounded border transition-colors duration-300',
        clickable ? 'hover:bg-yellow-100 cursor-pointer' : '',
        score !== null ? 'bg-gray-50 text-gray-400' : 'bg-white text-black',
        showSuggested ? 'border-blue-400 bg-blue-50' : 'border-transparent',
    ].join(' ');

    return (
        <div
            className={containerClasses}
            onClick={clickable ? () => onClick(category) : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
                clickable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onClick(category);
                        }
                    }
                    : undefined
            }
        >
            <div className="flex items-center text-base font-semibold">
                {isUpperSection && Icon && (
                    <Icon size={20} className="mr-2 text-gray-600" />
                )}
                {label}
                {bonusBadge && (
                    <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        +10
                    </span>
                )}
            </div>

            <div
                className={`min-w-[40px] text-right font-mono text-sm italic ${isAnimating ? 'text-green-600' : 'text-gray-700'
                    }`}
            >
                {score !== null
                    ? score
                    : showSuggested && typeof suggested === 'number' && !isNaN(suggested)
                        ? suggested
                        : ''}
            </div>
        </div>
    );
}
