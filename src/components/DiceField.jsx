// DiceField.jsx
import Card from 'react-bootstrap/Card';
import '../styles/Dice.css';

//const [bonusFadingOut, setBonusFadingOut] = useState(false);

export default function DiceField({ dice, toggleHold, rollDice, rollCount, dotPositions, isGameOver, resetGame }) {

    return (

        <div>
            <Card className='mb-4'>
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
