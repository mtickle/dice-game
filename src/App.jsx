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


function App() {
const [diceValues, setDiceValues] = useState([1, 1, 1, 1, 1]);

  const rollDice = () => {
    setDiceValues(Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1));
  };

  return (
    <>

      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Header>Upper Section</Card.Header>
              <Card.Body bg="Secondary" >
                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="ones">Ones: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="twos">Twos: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="threes">Threes: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="fours">Fours: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="fives">Fives: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="sixes">Sixes: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="subtotal">Subtotal: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="bonus">Bonus: </InputGroup.Text>
                  <Form.Control readOnly />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50" id="uppertotal">Upper Total: </InputGroup.Text>
                  <Form.Control readOnly />
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
        {diceValues.map((val, idx) => (
          <Dice key={idx} value={val} />
        ))}
      </div>
      <button onClick={rollDice}>Roll Dice</button>
              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>

    </>
  )
}

export default App
