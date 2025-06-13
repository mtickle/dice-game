import { Dice } from './Dice';

export default function DiceField({ dice, rollDice, toggleHold, rollCount }) {
    return (
        <div className="flex gap-4 justify-center p-4 bg-[#faf3e0] rounded-xl shadow-inner border border-[#d9cba3]">

            {/* Dice Display */}
            <div className="flex gap-4">
                {dice.map((die, index) => (
                    <div
                        key={index}
                        onClick={() => toggleHold(index)}
                        className={`w-20 h-20 p-2 rounded-xl border-4 transition-all duration-150 
                            ${die.held ? 'border-yellow-400' : 'border-transparent'}
                            bg-white shadow-md hover:scale-105 active:scale-95 cursor-pointer
                        `}
                    >
                        <Dice value={die.value} />
                    </div>
                ))}
            </div>

            {/* Roll Button */}
            <button
                onClick={rollDice}
                disabled={rollCount >= 3}
                className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-150
                    ${rollCount >= 3 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'}
                `}
            >
                {rollCount >= 3 ? 'Roll (3/3)' : `Roll (${rollCount}/3)`}
            </button>

        </div>
    );
}
