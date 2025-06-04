import { Accordion, Card } from 'react-bootstrap';

export default function GameLogPanel({ gameLog }) {
    if (!gameLog || gameLog.length === 0) {
        return (
            <Card className="mt-3">
                <Card.Body className="text-muted">No game events logged yet.</Card.Body>
            </Card>
        );
    }

    return (
        <Accordion className="mt-3" alwaysOpen>
            {gameLog.map((entry, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>
                        Turn {entry.turn} – {entry.category} for {entry.score} points
                    </Accordion.Header>
                    <Accordion.Body>
                        {entry.advice && typeof entry.advice === 'object' ? (
                            <div>
                                <strong>Advice at time:</strong><br />
                                <ul className="mb-1">
                                    {entry.advice.summary && <li><em>{entry.advice.summary}</em></li>}
                                    {entry.advice.advice && <li>{entry.advice.advice}</li>}
                                    {entry.advice.odds !== undefined && <li>Odds: {(entry.advice.odds * 100).toFixed(1)}%</li>}
                                    {entry.advice.target && <li>Target: {entry.advice.target}</li>}
                                </ul>
                            </div>
                        ) : entry.advice ? (
                            <div><strong>Advice at time:</strong> {entry.advice}</div>
                        ) : null}

                        <strong>Dice:</strong> {entry.dice.map(d => d.value).join(', ')} <br />
                        {entry.bonus && <div><strong>Bonus:</strong> +{entry.bonus} points 🎉</div>}
                        <div className="text-muted small">Player: {entry.player}</div>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
