export function Dice({ value }) {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Dice body */}
                <rect x="5" y="5" width="90" height="90" rx="15" fill="white" stroke="black" strokeWidth="5" />

                {/* Pips */}
                {renderPips(value)}
            </svg>
        </div>
    );
}

function renderPips(value) {
    const pip = (cx, cy) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" fill="black" />
    );

    const positions = {
        1: [[50, 50]],
        2: [[25, 25], [75, 75]],
        3: [[25, 25], [50, 50], [75, 75]],
        4: [[25, 25], [75, 25], [25, 75], [75, 75]],
        5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
        6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
    };

    return (positions[value] || []).map(([cx, cy]) => pip(cx, cy));
}
