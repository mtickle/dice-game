import { Dice } from '@components/Dice';

export default function DiceField({ dice, rollDice, toggleHold, rollCount, autoPlaying, setAutoPlaying }) {
    if (!dice || !Array.isArray(dice)) {
        console.error('[DiceField] Invalid dice prop:', dice);
        return (
            <div className="flex gap-4 justify-center bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc] text-red-500">
                Error: Dice not loaded.
            </div>
        );
    }

    return (
        <div className="flex gap-4 justify-center bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc] w-full ">
            {/* Dice Display */}
            <div className="flex gap-4">
                {dice.map((die, index) => (
                    <div
                        key={index}
                        onClick={() => toggleHold(index)}
                        className={`w-20 h-20 p-1 rounded-xl border-4 transition-all duration-150 
              ${die.held ? 'border-yellow-400' : 'border-transparent'}
              bg-white shadow-md hover:scale-105 active:scale-95 cursor-pointer
            `}
                    >
                        <Dice value={die.value} />
                    </div>
                ))}
            </div>

            <button
                onClick={rollDice}
                disabled={rollCount >= 3 || setAutoPlaying}
                className={`px-5 py-1 rounded-xl text-xs font-semibold transition-all duration-150
          ${rollCount >= 3 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'}
        `}
            >
                {rollCount >= 3 ? 'Roll (3/3)' : `Roll (${rollCount}/3)`}
            </button>
        </div>
    );
}