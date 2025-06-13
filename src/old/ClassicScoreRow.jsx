import '@/styles/ClassicScoreRow.css';

export default function ClassicScoreRow({ label, score, onClick, clickable, suggested }) {
    const handleClick = () => {
        if (clickable && onClick) {
            onClick();
        }
    };

    return (
        <div
            className={`classic-score-row ${clickable ? 'clickable' : ''} ${score !== null ? 'scored' : ''} ${suggested ? 'suggested' : ''}`}
            onClick={handleClick}
        >
            <div className="label">{label}</div>
            <div className="value">{score !== null ? score : (suggested ? suggested : '')}</div>
        </div>
    );
}
