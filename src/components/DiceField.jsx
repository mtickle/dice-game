// DiceField.jsx
import Card from 'react-bootstrap/Card';
import '../styles/Dice.css';
import SuggestedScores from './SuggestedScores';

//const [bonusFadingOut, setBonusFadingOut] = useState(false);

export default function DiceField({ dice, toggleHold, rollDice, rollCount, dotPositions, isGameOver, resetGame, suggestedScores, applyScore, scores, turnComplete, bonusMessage, bonusFadingOut }) {

    return (

        <div>
            <Card>
                <Card.Header>Play Field</Card.Header>
                <Card.Body bg="Secondary">
                    <div className="dice-field">
                        <div className="field">
                            {dice.map((die, index) => (
                                <div
                                    className={`die ${die.held ? 'held' : ''} ${die.value === null ? 'blank' : ''}`}
                                    key={index}
                                    onClick={() => toggleHold(index)}
                                >
                                    {[...Array(9)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="dot"
                                            style={{
                                                visibility:
                                                    die.value !== null && dotPositions[die.value]?.includes(i)
                                                        ? 'visible'
                                                        : 'hidden',
                                            }}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={rollDice} disabled={rollCount >= 3}>
                        Roll Dice ({rollCount}/3)
                    </button>

                    {bonusMessage && (
                        <div
                            className={`bonus-message alert alert-success text-center my-3 ${bonusFadingOut ? 'fade-out' : 'fade-in'
                                }`}
                        >
                            {bonusMessage}
                        </div>
                    )}


                    <SuggestedScores
                        suggestedScores={suggestedScores}
                        applyScore={applyScore}
                        scores={scores}
                        turnComplete={turnComplete}
                        rollCount={rollCount}
                    />

                    {isGameOver && (
                        <div className="game-over">
                            <h2>Game Over! 🎉</h2>
                            <button onClick={resetGame}>New Game</button>
                        </div>
                    )}

                </Card.Body>
            </Card>

        </div>
    );
}
