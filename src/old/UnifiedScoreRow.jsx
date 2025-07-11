// components/ScoreRow.jsx
import { useScoreAnimation } from '../../hooks/useScoreAnimation';
import { iconLibrary } from '../../icons/icons';

export default function UnifiedScoreRow({
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

    return (
        <div
            className={`score-row-container ${clickable ? 'clickable' : ''} ${showSuggested ? 'suggested' : ''
                }`}
            onClick={clickable ? () => onClick(category) : undefined}
            style={{
                cursor: clickable ? 'pointer' : 'default',
                backgroundColor: score !== null ? '#222' : 'transparent',
                color: score !== null ? '#ccc' : undefined,
            }}
            aria-label={`${label} score ${clickable ? ', clickable' : ''}`}
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

            <div className="score-label">
                {isUpperSection && Icon && (
                    <Icon size={24} className="icon me-2" aria-hidden="true" />
                )}
                {label}
                {bonusBadge && <span className="bonus-badge ms-2">+10</span>}
            </div>
            <div className={`score-number ${isAnimating ? 'score-animate' : ''}`}>
                {score !== null
                    ? score
                    : showSuggested && typeof suggested === 'number' && !isNaN(suggested)
                        ? suggested
                        : ''}
            </div>
        </div>
    );
}
