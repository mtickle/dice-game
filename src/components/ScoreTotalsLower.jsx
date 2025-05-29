import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function ScoreTotalsLower({
    lowerTotal,
    grandTotal,
}) {
    const rows = [
        { label: 'Lower Total', value: lowerTotal },
        { label: 'Grand Total', value: grandTotal },
    ];

    return (
        <div className="score-totals">
            {rows.map(({ label, value }) => (
                <InputGroup className="mb-2" key={label}>
                    <InputGroup.Text className="w-50"><strong>{label}</strong>:</InputGroup.Text>
                    <Form.Control readOnly value={value} />
                </InputGroup>
            ))}
        </div>
    );
}
