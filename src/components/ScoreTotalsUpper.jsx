import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function ScoreTotalsUpper({
    upperSubtotal,
    bonus,
    upperTotal,
}) {
    const rows = [
        { label: 'Subtotal', value: upperSubtotal },
        { label: 'Bonus', value: bonus },
        { label: 'Upper Total', value: upperTotal },
    ];

    return (
        <div className="score-totals">
            {rows.map(({ label, value }) => (
                <InputGroup className="mb-2" key={label}>
                    <InputGroup.Text className="w-50">{label}:</InputGroup.Text>
                    <Form.Control readOnly value={value} />
                </InputGroup>
            ))}
        </div>
    );
}
