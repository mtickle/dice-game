export default function ScoreRow({
    label,
    score,
    onClick,
    clickable,
    bonusBadge,
    suggested,
}) {
    return (
        <div
            onClick={clickable ? onClick : undefined}
            className={`flex justify-between items-center p-2 border rounded cursor-pointer select-none 
                ${clickable ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-white'}
                ${score != null ? 'bg-gray-100' : ''}
            `}
        >
            <div className="font-semibold">{label}</div>
            <div className="flex items-center space-x-2">
                {bonusBadge && <div className="text-green-500 font-bold">+10</div>}
                <div>{score != null ? score : (suggested != null ? suggested : '')}</div>
            </div>
        </div>
    );
}
