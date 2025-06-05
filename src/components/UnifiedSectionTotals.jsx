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
        { label: 'Upper Subtotal ➡️', value: upperSubtotal },
        { label: 'Bonus 🎆', value: bonus },
        { label: 'Upper Total ➡️', value: upperTotal },
        { label: 'Lower Total ➡️', value: lowerTotal },
        { label: 'Grand Total ➡️', value: grandTotal },

    ];

    return (


        <div>
            <div className="mb-1">&nbsp;</div>
            {rows.map(({ label, value }) => {
                if (value == null) return null; // skip if null or undefined
                return (
                    <InputGroup className="mb-2" key={label}>
                        <InputGroup.Text className="w-50 text-right"><em>{label}:</em></InputGroup.Text>
                        <Form.Control readOnly value={value} />
                    </InputGroup>
                );
            })}
        </div>
    );
}
