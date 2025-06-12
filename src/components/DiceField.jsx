export default function DiceField({ dice, rollDice, toggleHold }) {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-4">
            {dice.map((die, index) => (
                <div
                    key={index}
                    className={`w-20 h-20 flex items-center justify-center rounded border-2 ${die.held ? 'border-green-500' : 'border-gray-400'} bg-white shadow-md text-2xl font-bold`}
                    onClick={() => toggleHold(index)}
                >
                    {die.value || '-'}
                </div>
            ))}
            <button
                onClick={rollDice}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
                Roll Dice
            </button>
        </div>
    );
}
