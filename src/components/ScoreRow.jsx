// components/ScoreRow.jsx

export default function ScoreRow({
    label,
    score,
    onClick,
    clickable,
    bonusBadge,
    suggested,
}) {
    const isScored = score != null;

    const backgroundClass = isScored
        ? "bg-gray-100"
        : suggested != null
            ? "bg-green-100"
            : "bg-white";

    const rowClasses = [
        "flex justify-between items-center px-3 py-2 border-b border-dashed",
        clickable ? "cursor-pointer hover:bg-yellow-100" : "cursor-default",
        backgroundClass,
        suggested != null && !isScored ? "border-red-500" : ""
    ].join(" ");

    return (
        <div
            onClick={clickable ? onClick : undefined}
            className={rowClasses}
        >
            <div className="font-semibold text-gray-800">{label}</div>
            <div className="flex items-center space-x-2">
                {bonusBadge && <div className="text-green-500 font-bold">+10</div>}
                <div>{isScored ? score : (suggested != null ? suggested : '')}</div>
            </div>
        </div>
    );
}
