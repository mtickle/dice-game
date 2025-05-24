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
import { motion, AnimatePresence } from 'framer-motion';

const initialScores = {
  ones: null,
  twos: null,
  threes: null,
  fours: null,
  fives: null,
  sixes: null,
  threeKind: null,
  fourKind: null,
  fullHouse: null,
  smallStraight: null,
  largeStraight: null,
  yahtzee: null,
  chance: null,
};

function App() {

  // Dice state: 5 dice, each with value (1-6 or null) and held status
  const [dice, setDice] = useState(
    Array(5).fill().map(() => ({ value: null, held: false }))
  );

  // Dot positions for drawing dots on dice faces (0 to 8 grid positions)
  const dotPositions = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  const iconMap = {
  yahtzee: '🌟',
  fullHouse: '🏠',
  smallStraight: '➡️',
  largeStraight: '⏩',
  threeKind: '🎯',
  fourKind: '💥',
  chance: '🎲',
};

  const [rollCount, setRollCount] = useState(0);
  const [scores, setScores] = useState(initialScores);
  const [turnComplete, setTurnComplete] = useState(false);

  // Check if all categories scored → Game Over
  const isGameOver = Object.values(scores).every(score => score !== null);

  // Upper section categories
  const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];

  // Calculate subtotal of upper categories (treat null as zero)
  const subtotal = upperCategories.reduce(
    (sum, key) => sum + (scores[key] ?? 0),
    0
  );

  // Bonus if subtotal >= 63
  const bonus = subtotal >= 63 ? 35 : 0;
  const upperTotal = subtotal + bonus;

  // Roll dice (max 3 rolls, and only if turn not complete)
  const rollDice = () => {
    if (rollCount >= 3 || turnComplete) return;

    setDice(prev =>
      prev.map(die =>
        die.held ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 }
      )
    );
    setRollCount(prev => prev + 1);
  };

  // Toggle hold/unhold die by index
  const toggleHold = (index) => {
    if (turnComplete || rollCount === 0) return; // optional: prevent hold before first roll
    setDice(dice.map((die, i) =>
      i === index ? { ...die, held: !die.held } : die
    ));
  };

  // Count dice values (array of counts for 1-6)
  const getCounts = (dice) => {
    const counts = Array(6).fill(0);
    dice.forEach(d => {
      if (d.value !== null) counts[d.value - 1]++;
    });
    return counts;
  };

  // Check if counts have a straight of given length
  const hasStraight = (counts, length) => {
    const binary = counts.map(c => (c > 0 ? 1 : 0)).join('');
    // For length 4 or 5, check known straight patterns in the binary string
    const straights = {
      4: ['1111', '01111', '11110'],
      5: ['11111', '011111', '111110'],
    }[length];
    return straights.some(pattern => binary.includes(pattern));
  };

  // Calculate score for lower section categories
  const calculateScore = (category, dice) => {
    const values = dice.map(d => d.value).filter(v => v !== null);
    const counts = getCounts(dice);
    const total = values.reduce((a, b) => a + b, 0);

    switch (category) {
      case 'threeKind':
        return counts.some(c => c >= 3) ? total : 0;
      case 'fourKind':
        return counts.some(c => c >= 4) ? total : 0;
      case 'fullHouse':
        return counts.includes(3) && counts.includes(2) ? 25 : 0;
      case 'smallStraight':
        return hasStraight(counts, 4) ? 30 : 0;
      case 'largeStraight':
        return hasStraight(counts, 5) ? 40 : 0;
      case 'yahtzee':
        return counts.includes(5) ? 50 : 0;
      case 'chance':
        return total;
      default:
        return 0;
    }
  };

  // Apply score for a category when user selects it
  const applyScore = (category) => {
    if (scores[category] !== null || turnComplete || rollCount === 0) return;

    setTurnComplete(true);

    let score = 0;
    if (upperCategories.includes(category)) {
      const num = {
        ones: 1, twos: 2, threes: 3,
        fours: 4, fives: 5, sixes: 6,
      }[category];
      const count = dice.filter(d => d.value === num).length;
      score = count * num;
    } else {
      score = calculateScore(category, dice);
    }

    setScores(prev => ({ ...prev, [category]: score }));

    // Reset dice for next turn after short delay (for UI update)
    setTimeout(() => {
      setDice(Array(5).fill().map(() => ({ value: null, held: false })));
      setRollCount(0);
      setTurnComplete(false);
    }, 100);
  };

  // Lower section categories
  const lowerCategories = [
    'threeKind', 'fourKind', 'fullHouse',
    'smallStraight', 'largeStraight', 'yahtzee', 'chance'
  ];

  // Calculate lower total
  const lowerTotal = lowerCategories.reduce(
    (sum, key) => sum + (scores[key] ?? 0),
    0
  );

  // Grand total
  const grandTotal = upperTotal + lowerTotal;

  // Calculate suggested scores for UI hints (only for unscored categories)
  const suggestedScores = {};
  Object.keys(scores).forEach(category => {
    if (scores[category] === null) {
      if (upperCategories.includes(category)) {
        const num = {
          ones: 1, twos: 2, threes: 3,
          fours: 4, fives: 5, sixes: 6,
        }[category];
        const count = dice.filter(d => d.value === num).length;
        suggestedScores[category] = count * num;
      } else {
        suggestedScores[category] = calculateScore(category, dice);
      }
    }
  });

  // Reset entire game state
  function resetGame() {
    setDice(Array(5).fill().map(() => ({ value: null, held: false })));
    setScores({
      ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
      threeKind: null, fourKind: null, fullHouse: null, smallStraight: null,
      largeStraight: null, yahtzee: null, chance: null,
    });
    setRollCount(0);
    setTurnComplete(false);
  }

  // Helper to pretty-print category names
  const prettyName = (key) => {
    const map = {
      ones: 'Ones', twos: 'Twos', threes: 'Threes',
      fours: 'Fours', fives: 'Fives', sixes: 'Sixes',
      threeKind: '3 of a Kind', fourKind: '4 of a Kind',
      fullHouse: 'Full House', smallStraight: 'Small Straight',
      largeStraight: 'Large Straight', yahtzee: 'Yahtzee', chance: 'Chance',
    };
    return map[key] || key;
  };

function SuggestedScores({ suggestedScores, applyScore, scores, turnComplete, rollCount }) {
  const eligibleSuggestions = Object.entries(suggestedScores).filter(
    ([category, score]) =>
      scores[category] === null && score > 0 && rollCount > 0 && !turnComplete
  );

  if (eligibleSuggestions.length === 0) return null;

  return (
    <div className="mt-4">     
      <div className="d-flex flex-wrap gap-2">
        <AnimatePresence>
          {eligibleSuggestions.map(([category, score]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => applyScore(category)}
              className={`suggestion-card ${
                ['yahtzee', 'largeStraight', 'fourKind'].includes(category) ? 'highlight' : ''
              }`}
              title={`Score ${score} for ${prettyName(category)}`}
            >
              <span className="emoji">{iconMap[category] || '🎯'}</span>{' '}
              <strong>{prettyName(category)}</strong>: {score}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}


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
                  <InputGroup.Text className="w-50">3 of a Kind:</InputGroup.Text>
                  <Form.Control
                    readOnly
                    value={scores.threeKind ?? ''}
                    onClick={() => applyScore('threeKind')}
                    disabled={scores.threeKind !== null || turnComplete}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50">4 of a Kind:</InputGroup.Text>
                  <Form.Control
                    readOnly
                    value={scores.fourKind ?? ''}
                    onClick={() => applyScore('fourKind')}
                    disabled={scores.fourKind !== null || turnComplete}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50">Full House:</InputGroup.Text>
                  <Form.Control
                    readOnly
                    value={scores.fullHouse ?? ''}
                    onClick={() => applyScore('fullHouse')}
                    disabled={scores.fullHouse !== null || turnComplete}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50">Small Straight:</InputGroup.Text>
                  <Form.Control
                    readOnly
                    value={scores.smallStraight ?? ''}
                    onClick={() => applyScore('smallStraight')}
                    disabled={scores.smallStraight !== null || turnComplete}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50">Large Straight:</InputGroup.Text>
                  <Form.Control
                    readOnly
                    value={scores.largeStraight ?? ''}
                    onClick={() => applyScore('largeStraight')}
                    disabled={scores.largeStraight !== null || turnComplete}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50">Yahtzee:</InputGroup.Text>
                  <Form.Control
                    readOnly
                    value={scores.yahtzee ?? ''}
                    onClick={() => applyScore('yahtzee')}
                    disabled={scores.yahtzee !== null || turnComplete}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50">Chance:</InputGroup.Text>
                  <Form.Control
                    readOnly
                    value={scores.chance ?? ''}
                    onClick={() => applyScore('chance')}
                    disabled={scores.chance !== null || turnComplete}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50">Lower Total:</InputGroup.Text>
                  <Form.Control readOnly value={lowerTotal} />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text className="w-50">Grand Total:</InputGroup.Text>
                  <Form.Control readOnly value={grandTotal} />
                </InputGroup>

              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header>Play Field</Card.Header>
              <Card.Body bg="Secondary" >

                <div className="field">
                  {dice.map((die, index) => (
                    <div
                      className={`die ${die.held ? 'held' : ''} ${die.value === null ? 'blank' : ''}`}
                      key={index}
                      onClick={() => toggleHold(index)}
                    >
                      {[...Array(9)].map((_, i) => (
                        <span
                          key={i}
                          className="dot"
                          style={{
                            visibility:
                              die.value !== null && dotPositions[die.value]?.includes(i)
                                ? 'visible'
                                : 'hidden',
                          }}
                        />
                      ))}
                    </div>
                  ))}


                </div>

                <button onClick={rollDice} disabled={rollCount >= 3}>
                  Roll Dice ({rollCount}/3)
                </button>

                {/* <button
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
                </button> */}

                {isGameOver && (
                  <div className="game-over">
                    <h2>Game Over! 🎉</h2>
                    <button onClick={resetGame}>New Game</button>
                  </div>
                )}

              </Card.Body>
            </Card>
            &nbsp;
            <Card>
              <Card.Header>Scoring Hints</Card.Header>
              <Card.Body bg="Secondary" >

                <SuggestedScores
                  suggestedScores={suggestedScores}
                  applyScore={applyScore}
                  scores={scores}
                  turnComplete={turnComplete}
                  rollCount={rollCount}
                />

              </Card.Body>
            </Card>


          </Col>
        </Row>
      </Container>

    </>
  )
}

export default App
