import React from 'react';
import './Dice.css';

const dotPositions = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
};

export default function Dice({ value, held, onClick }) {
    return (
        <div className={`dice ${held ? 'held' : ''}`} onClick={onClick}>
            {Array.from({ length: 9 }).map((_, i) => (
                <div
                    key={i}
                    className="dot"
                    style={{ visibility: dotPositions[value].includes(i) ? 'visible' : 'hidden' }}
                ></div>
            ))}
        </div>
    );
}
