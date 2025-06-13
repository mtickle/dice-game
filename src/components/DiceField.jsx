// components/DiceField.jsx

const pipMap = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [25, 75], [75, 25], [75, 75]],
    5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
    6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
};

export default function DiceField({ dice, rollDice, toggleHold, rollCount }) {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center gap-2">
                {dice.map((die, index) => (
                    <div
                        key={index}
                        className={`w-10 h-10 bg-white rounded border-2 flex items-center justify-center relative transition-all duration-300 shadow 
                          ${die.held ? 'bg-yellow-300 border-yellow-500' : 'border-gray-500'}`}
                        onClick={() => toggleHold(index)}
                    >
                        {die.value &&
                            pipMap[die.value].map((pos, i) => (
                                <div
                                    key={i}
                                    className="w-[3px] h-[3px] bg-black rounded-full absolute"
                                    style={{
                                        top: `${pos[1]}%`,
                                        left: `${pos[0]}%`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                />
                            ))}
                    </div>
                ))}
            </div>

            <button
                onClick={rollDice}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 disabled:opacity-50"
                disabled={rollCount >= 3}
            >
                Roll Dice ({rollCount}/3)
            </button>
        </div>
    );
}
