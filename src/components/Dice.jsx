// components/Dice.jsx

export function Dice({ value }) {
    const pip = (cx, cy) => <circle cx={cx} cy={cy} r="8" fill="black" />;

    const faces = {
        1: [pip(50, 50)],
        2: [pip(30, 30), pip(70, 70)],
        3: [pip(30, 30), pip(50, 50), pip(70, 70)],
        4: [pip(30, 30), pip(30, 70), pip(70, 30), pip(70, 70)],
        5: [pip(30, 30), pip(30, 70), pip(70, 30), pip(70, 70), pip(50, 50)],
        6: [pip(30, 30), pip(30, 50), pip(30, 70), pip(70, 30), pip(70, 50), pip(70, 70)],
    };

    return (
        <svg width="80" height="80" viewBox="0 0 100 100" className="rounded-lg bg-white border-2 border-black shadow-lg">
            <rect x="0" y="0" width="100" height="100" rx="15" ry="15" fill="white" />
            {faces[value] || null}
        </svg>
    );
}
