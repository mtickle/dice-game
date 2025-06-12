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
        "flex justify-between items-center px-3 py-2 border border-transparent rounded transition-colors",
        clickable ? "hover:bg-gray-100 cursor-pointer" : "",
        suggested ? "bg-yellow-100 border-yellow-300" : "",
        score !== null ? "bg-white text-gray-400" : "text-black",
    ].join(" ");

    return (
        <div
            className={containerClass}
            onClick={clickable ? () => onClick(category) : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            aria-label={`${label} score${clickable ? ', clickable' : ''}`}
            onKeyDown={
                clickable
                    ? e => { if (e.key === 'Enter' || e.key === ' ') { onClick(category); } }
                    : undefined
            }
        >
            <div className="flex items-center space-x-2 text-[1rem] font-medium">
                {isUpperSection && Icon && (
                    <Icon size={24} className="text-current" aria-hidden="true" />
                )}
                <span>{label}</span>
                {bonusBadge && (
                    <span className="ml-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        +10
                    </span>
                )}
            </div>

            <div className={`min-w-[40px] text-right italic text-[0.9rem] ${isAnimating ? 'text-green-600' : 'text-gray-500'}`}>
                {score !== null
                    ? score
                    : showSuggested && typeof suggested === 'number' && !isNaN(suggested)
                        ? suggested
                        : ''}
            </div>
        </div>
    );
}
