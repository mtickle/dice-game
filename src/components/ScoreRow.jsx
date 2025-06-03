// components/ScoreRow.jsx
import { Form, InputGroup } from 'react-bootstrap';

export default function ScoreRow({ category, label, score, onClick, clickable, bonusBadge, suggested }) {
    const className = `w-50 score-row 
        ${clickable ? 'clickable' : ''}         
        ${suggested ? 'suggested-glow' : ''}`;

    const showSuggested = score === null && suggested !== undefined;

    //console.log(`ScoreRow props: category=${category}, label=${label}, score=${score}, suggested=${suggested}, clickable=${clickable}, bonusBadge=${bonusBadge}`);
    //console.log(`Rendering ScoreRow for category: ${category} with score: ${score}, suggested: ${suggested}`);

    if (score === null && typeof suggested === 'number' && Number.isNaN(suggested)) {
        console.warn(`⚠️ NaN detected in category ${category}`);
    }

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
                {bonusBadge && <span className="bonus-badge ms-2">+10</span>}
            </InputGroup.Text>
            <Form.Control
                className={showSuggested ? 'text-muted' : ''}
                readOnly
                value={
                    score !== null
                        ? String(score)
                        : showSuggested && typeof suggested === 'number' && !Number.isNaN(suggested)
                            ? String(suggested)
                            : ''
                }
            />
        </InputGroup>
    );
}

