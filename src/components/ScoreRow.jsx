// components/ScoreRow.jsx
import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';

export default function ScoreRow({ category, label, score, onClick, clickable }) {
    return (
        <InputGroup className="mb-3">
            <InputGroup.Text
                className="w-50"
                id={category}
                onClick={clickable ? () => onClick(category) : undefined}
                style={{
                    cursor: clickable ? 'pointer' : 'default',
                    backgroundColor: score !== null ? '#444' : undefined,
                    color: score !== null ? '#ccc' : undefined,
                }}
            >
                {label}:
            </InputGroup.Text>
            <Form.Control readOnly value={score ?? ''} />
        </InputGroup>
    );
}
