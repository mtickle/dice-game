// components/ScoreRow.jsx
import { Form, InputGroup } from 'react-bootstrap';

export default function ScoreRow({ category, label, score, onClick, clickable, isBonus }) {
    const className = `w-50 score-row ${clickable ? 'clickable' : ''} ${isBonus ? 'bonus-flash' : ''}`;

    return (
        <InputGroup className="mb-2">
            <InputGroup.Text
                className={className}
                id={category}
                onClick={clickable ? () => onClick(category) : undefined}
                style={{
                    cursor: clickable ? 'pointer' : 'default',
                    backgroundColor: score !== null ? '#444' : undefined,
                    color: score !== null ? '#ccc' : undefined,
                }}
            >
                {label}:
                {/* {iconMap[category]} */}
            </InputGroup.Text>
            <Form.Control className='w-50' readOnly value={score ?? ''} />
        </InputGroup>
    );
}

