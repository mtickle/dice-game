import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//--- CSS imports.
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

//--- Bootstrap imports.
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dice from './Dice';


const initialScores = {
  ones: null,
  twos: null,
  threes: null,
  fours: null,
  fives: null,
  sixes: null,
};

function App() {

  const [dice, setDice] = useState(
    Array(5).fill().map(() => ({ value: 1, held: false }))
  );

  const [rollCount, setRollCount] = useState(0);
  const [scores, setScores] = useState(initialScores);
  const [turnComplete, setTurnComplete] = useState(false);

  const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];

  const subtotal = upperCategories.reduce(
    (sum, key) => sum + (scores[key] ?? 0),
    0
  );

  const bonus = subtotal >= 63 ? 35 : 0;
  const upperTotal = subtotal + bonus;

  const rollDice = () => {
    if (rollCount >= 3 && !turnComplete) return;

    if (turnComplete) {
      // Reset for a new turn
      setDice(dice.map(d => ({ ...d, held: false })));
      setRollCount(0);
      setTurnComplete(false);
    }

    setDice(dice.map(die =>
      die.held ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 }
    ));
    setRollCount(prev => prev + 1);
  };

  const toggleHold = (index) => {
    setDice(dice.map((die, i) =>
      i === index ? { ...die, held: !die.held } : die
    ));
  };

  const applyScore = (category) => {
    if (scores[category] !== null || turnComplete || rollCount === 0) return;

    // Prevent any additional scoring instantly
    setTurnComplete(true);

    const num = {
      ones: 1,
      twos: 2,
      threes: 3,
      fours: 4,
      fives: 5,
      sixes: 6,
    }[category];

    const count = dice.filter(d => d.value === num).length;
    const score = count * num;

    setScores(prev => ({ ...prev, [category]: score }));

    // Reset dice and roll count after score is locked in
    setTimeout(() => {
      setDice(Array(5).fill().map(() => ({ value: 1, held: false })));
      setRollCount(0);
      setTurnComplete(false);
    }, 100); // Delay a bit so the score update visually completes
  };


  return (
    <>

      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Header>Upper Section</Card.Header>
              <Card.Body bg="Secondary" >
                {['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].map((category) => (
                  <InputGroup className="mb-3" key={category}>
                    <InputGroup.Text className="w-50" id={category}>
                      {category[0].toUpperCase() + category.slice(1)}:
                    </InputGroup.Text>

                    <Form.Control
                      readOnly
                      disabled={scores[category] !== null || turnComplete}
                      value={scores[category] ?? ''}
                      onClick={() => applyScore(category)}
                      style={{
                        //backgroundColor: scores[category] !== null ? '#c0c0c0' : 'grey',
                        cursor: scores[category] !== null || turnComplete ? 'not-allowed' : 'pointer'
                      }}
                    />

                  </InputGroup>
                ))}
                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="subtotal">Subtotal: </InputGroup.Text>
                  <Form.Control readOnly value={subtotal} />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="bonus">Bonus: </InputGroup.Text>
                  <Form.Control style={{
                    fontWeight: bonus > 0 ? 'bold' : 'normal',
                    color: bonus > 0 ? '#00FF00' : 'inherit',
                  }} readOnly value={bonus} />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="uppertotal">Upper Total: </InputGroup.Text>
                  <Form.Control readOnly value={upperTotal} />
                </InputGroup>

              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header>Lower Section</Card.Header>
              <Card.Body bg="Secondary" >
                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="3ofakind">3 of a Kind: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="4ofakind">4 of a Kind: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="fullhouse">Full House: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="smallstraight">Small Straight: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="largestraight">Large Straight: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="yahtzee">Yahtzee: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="chance">Chance: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="lowertotal">Lower Total: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="grandtotal">Grand Total: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header>Play Field</Card.Header>
              <Card.Body bg="Secondary" >

                <div className="field">
                  {dice.map((die, idx) => (
                    <Dice key={idx} value={die.value} held={die.held} onClick={() => toggleHold(idx)} />
                  ))}
                </div>

                <button onClick={rollDice} disabled={rollCount >= 3}>
                  Roll Dice ({rollCount}/3)
                </button>

                <button
                  onClick={() =>
                    setScores(prev => ({
                      ...prev,
                      ones: 5,
                      twos: 10,
                      threes: 15,
                      fours: 20,
                      fives: 25,
                      sixes: 30,
                    }))
                  }
                >
                  🔧 Simulate Bonus
                </button>

              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>

    </>
  )
}

export default App
