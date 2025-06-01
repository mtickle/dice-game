import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function UnifiedSectionTotals({
    upperSubtotal,
    bonus,
    upperTotal,
    lowerTotal,
    grandTotal,
}) {
    const rows = [
        { label: 'Upper Subtotal', value: upperSubtotal },
        { label: 'Bonus', value: bonus },
        { label: 'Upper Total', value: upperTotal },
        { label: 'Lower Total', value: lowerTotal },
        { label: 'Grand Total', value: grandTotal },

    ];

    return (
        <Card>
            <Card.Header>Scores</Card.Header>
            <Card.Body bg="Secondary">
                {rows.map(({ label, value }) => (
                    <InputGroup className="mb-2" key={label}>
                        <InputGroup.Text className="w-50">{label}:</InputGroup.Text>
                        <Form.Control readOnly value={value} />
                    </InputGroup>
                ))}
            </Card.Body>
        </Card>

    );
}
