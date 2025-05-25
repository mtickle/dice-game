import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

export default function ScoreTotalsLower({
    subtotal,
    bonus,
    upperTotal,
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
                <InputGroup className="mb-3" key={label}>
                    <InputGroup.Text className="w-50">{label}:</InputGroup.Text>
                    <Form.Control readOnly value={value} />
                </InputGroup>
            ))}
        </div>
    );
}
