import { Accordion, Card } from 'react-bootstrap';
import { prettyName } from '../utils/utils';

export default function GameLogPanel({ gameLog }) {
    if (!gameLog || gameLog.length === 0) {
        return (

            <Card className='mb-4'>
                <Card.Header>Turn History</Card.Header>
                <Card.Body bg="Secondary">
                    <div className="text-muted">No game events logged yet.</div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className='mb-4'>
            <Card.Header>Turn History</Card.Header>
            <Card.Body bg="Secondary">
                <Accordion className="mt-3" alwaysOpen>
                    {gameLog.slice().reverse().map((entry, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index}>
                            <Accordion.Header>
                                Turn {entry.turn} – {prettyName(entry.category)} for {entry.score} points
                            </Accordion.Header>
                            <Accordion.Body>
                                {entry.advice && typeof entry.advice === 'object' ? (
                                    <div className="text-start">
                                        <div>Suggested: <em>{entry.advice.summary}</em></div>
                                        <div>Actual: {prettyName(entry.category)} for {entry.score}</div>
                                        <div>Dice: {entry.dice.map(d => d.value).join(', ')}</div>
                                        {entry.bonus ? <div>Bonus: +{entry.bonus} points</div> : null}
                                        {/* <div>Bonus: +{entry.bonus} points</div> */}
                                    </div>
                                ) : null}
                                {/* <div className="text-muted small">Player: {entry.player}</div> */}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Card.Body> </Card>
    );
}
