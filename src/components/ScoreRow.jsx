export default function ScoreRow({
    label,
    score,
    onClick,
    clickable,
    bonusBadge,
    suggested,
}) {
    const isScored = score != null;

    const rowClasses = [
        "flex justify-between items-center p-2 border rounded select-none transition",
        clickable ? "cursor-pointer bg-yellow-100 hover:bg-yellow-200" : "cursor-default bg-white",
        isScored ? "bg-gray-100" : "",
        suggested != null && !isScored ? "border-green-400 bg-green-100" : "border-gray-300"
    ].join(" ");

    return (
        <div
            onClick={clickable ? onClick : undefined}
            className={rowClasses}
        >
            <div className="font-semibold">{label}</div>
            <div className="flex items-center space-x-2">
                {bonusBadge && <div className="text-green-500 font-bold">+10</div>}
                <div>{isScored ? score : (suggested != null ? suggested : '')}</div>
            </div>
        </div>
    );
}
