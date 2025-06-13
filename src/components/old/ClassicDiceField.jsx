import '@/styles/DiceField.css'; // we'll create this CSS next

export default function ClassicDiceField({ dice, rollDice, toggleHold, rollCount, turnComplete, isGameOver }) {
    const handleRoll = () => {
        if (!turnComplete && !isGameOver) {
            rollDice();
        }
    };

    return (
        <div className="dice-field-container">
            <div className="dice-wrapper">
                {dice.map((die, idx) => (
                    <div
                        key={idx}
                        className={`die ${die.held ? 'held' : ''} ${die.value ? 'active' : ''}`}
                        onClick={() => toggleHold(idx)}
                    >
                        {die.value ? die.value : '-'}
                    </div>
                ))}
            </div>

            <button
                className="roll-button"
                onClick={handleRoll}
                disabled={rollCount >= 3 || turnComplete || isGameOver}
            >
                Roll Dice ({rollCount}/3)
            </button>
        </div>
    );
}
