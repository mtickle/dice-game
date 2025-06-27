import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function HelperPanel({ resetGameLog, resetGame }) {
    return (
        <Card className="mb-3 shadow-sm " bg="dark" text="light">
            <Card.Header>Helper Panel</Card.Header>
            <Card.Body>
                <Card.Text className="text-muted">
                    <Button variant="danger" size="sm" onClick={resetGameLog}>
                        Clear Stats
                    </Button>
                    &nbsp;
                    <Button variant="danger" size="sm" onClick={resetGame}>
                        Reset Game
                    </Button>
                </Card.Text>
            </Card.Body>
        </Card>
    );

}
