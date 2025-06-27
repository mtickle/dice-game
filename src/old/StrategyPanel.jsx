import Card from 'react-bootstrap/Card';

export default function StrategyPanel({ strategy, rollCount }) {
    if (!strategy) return null;

    if (rollCount === 0) {
        return (
            <Card className="mb-3 shadow-sm " bg="dark" text="light">
                <Card.Header>Turn Analysis</Card.Header>
                <Card.Body>
                    <Card.Text className="text-muted">
                        Roll the dice to get strategic advice.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="mb-3 shadow-sm " bg="dark" text="light">
            <Card.Header>Turn Analysis</Card.Header>
            <Card.Body>
                <div className="text-start">
                    {rollCount > 0 && (
                        <>
                            {strategy.advice.map((line, index) => (
                                <div key={index}> {line}</div>
                            ))}
                        </>
                    )}
                </div>

            </Card.Body>
        </Card>
    );
}
