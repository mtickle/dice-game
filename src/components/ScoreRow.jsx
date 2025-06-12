import clsx from 'clsx'; // Optional helper for class management
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

    const containerClass = clsx(
        'flex justify-between items-center py-1 px-2 border-2 transition-colors duration-200',
        'rounded-sm text-black',
        {
            'bg-gray-200 border-gray-300': score !== null, // scored rows
            'bg-white border-gray-300': score === null,    // unscored rows
            'hover:bg-yellow-100 cursor-pointer': clickable, // clickable hover
            'bg-gray-300 border-indigo-500': suggested,    // suggested highlight
        }
    );

    return (
        <div className={containerClass}
            onClick={clickable ? () => onClick(category) : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
                clickable
                    ? e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onClick(category);
                        }
                    }
                    : undefined
            }
        >
            <div className="flex items-center text-base font-medium">
                {isUpperSection && Icon && (
                    <Icon size={24} className="mr-2 text-black" aria-hidden="true" />
                )}
                {label}
                {bonusBadge && (
                    <span className="ml-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-full min-w-[30px] text-center">
                        +10
                    </span>
                )}
            </div>
            <div className={clsx(
                "min-w-[40px] text-right italic text-sm transition-colors duration-300",
                { "text-green-600": isAnimating, "text-gray-500": !isAnimating }
            )}>
                {score !== null
                    ? score
                    : showSuggested && typeof suggested === 'number' && !isNaN(suggested)
                        ? suggested
                        : ''}
            </div>
        </div>
    );
}
