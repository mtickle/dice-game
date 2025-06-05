import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import Form from 'react-bootstrap/Form';
import { computeStats } from '../utils/statsUtils';

export default function StatsPanel({ gameLog, resetGameLog, resetGame }) {
    const stats = computeStats(gameLog);

    if (!stats) {
        return (
            <Card className='mb-4'>
                <Card.Header>Game Stats</Card.Header>
                <Card.Body>
                    No stats available.
                </Card.Body>
            </Card>
        )
    }

    return (
        <Card className='mb-4'>
            <Card.Header>Game Stats</Card.Header>
            <Card.Body>

                <InputGroup className="mb-2">
                    <InputGroup.Text className="w-50"><strong>Total Turns</strong>:</InputGroup.Text>
                    <Form.Control readOnly value={stats.totalTurns} />
                </InputGroup>
                <InputGroup className="mb-2">
                    <InputGroup.Text className="w-50"><strong>Total Score</strong>:</InputGroup.Text>
                    <Form.Control readOnly value={stats.totalScore} />
                </InputGroup>
                <InputGroup className="mb-2">
                    <InputGroup.Text className="w-50"><strong>Average per Turn</strong>:</InputGroup.Text>
                    <Form.Control readOnly value={stats.averageScore} />
                </InputGroup>
                <InputGroup className="mb-2">
                    <InputGroup.Text className="w-50"><strong>First Roll Bonuses</strong>:</InputGroup.Text>
                    <Form.Control readOnly value={stats.firstRollBonuses} />
                </InputGroup>


                {/* <h6 className="mt-3">Average Score by Category</h6>
                <ul className="mb-0">
                    {Object.entries(stats.averageScoreByCategory).map(([category, avg]) => (
                        <li key={category}>
                            {prettyName(category)}: {avg}
                        </li>
                    ))}
                </ul> */}

            </Card.Body>
        </Card>
    );
}
