import Card from 'react-bootstrap/Card';

export default function StrategyPanel({ strategy, rollCount }) {
    if (!strategy) return null;

    if (rollCount === 0) {
        return (
            <Card className="mb-3 shadow-sm strategy-panel" bg="dark" text="light">
                <Card.Header>Helper</Card.Header>
                <Card.Body>
                    <Card.Text className="text-muted">
                        Roll the dice to get strategic advice.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="mb-3 shadow-sm strategy-panel" bg="dark" text="light">
            <Card.Header>Helper</Card.Header>
            <Card.Body>

                {rollCount > 0 && (
                    <>

                        {strategy.advice.map((line, index) => (
                            <div key={index}> {line}</div>
                        ))}

                        {strategy.odds && (
                            <div className="mt-2 text-muted small">
                                Chance of success: <strong>{strategy.odds}</strong>
                            </div>
                        )}
                    </>
                )}

            </Card.Body>
        </Card>
    );
}
