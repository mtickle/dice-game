// components/DiceField.jsx

import { Dice } from './Dice';

export default function DiceField({ dice, rollDice, toggleHold, rollCount }) {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
                {dice.map((die, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer transform transition-transform duration-150 ${die.held
                            ? 'scale-105 border-1 border-green-500 rounded-lg shadow-lg'
                            : 'hover:scale-105'
                            }`}
                        onClick={() => toggleHold(index)}
                    >
                        <Dice value={die.value} />
                    </div>
                ))}
            </div>

            <button
                className={`px-6 py-3 bg-green-600 text-white rounded-lg shadow-md text-lg font-semibold transition 
                    ${rollCount >= 3 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                onClick={rollDice}
                disabled={rollCount >= 3}
            >
                {rollCount === 0 ? 'Roll' : `Roll (${rollCount}/3)`}
            </button>
        </div>
    );
}
