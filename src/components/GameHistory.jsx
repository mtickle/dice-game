import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

export default function GameHistory({ history }) {
    if (!history.length) return null;

    return (
        <Card className="mt-4">
            <Card.Header>🎲 Game History</Card.Header>
            <ListGroup variant="flush">
                {history.map((game, index) => (
                    <ListGroup.Item key={index}>
                        <strong>{game.timestamp}</strong><br />
                        Upper: {game.upperTotal}, Lower: {game.lowerTotal}, <strong>Total: {game.grandTotal}</strong>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
}
