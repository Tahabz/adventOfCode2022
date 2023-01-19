const fs = require('fs')
const { pipeline, Writable } = require('stream')

const ROCK = 'ROCK'
const PAPER = 'PAPER'
const SCISSORS = 'SCISSORS'

const DRAW = 'DRAW'
const LOST = 'LOST'
const WON = 'WON'

const opponentsPlay = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS
}

const myPlay = {
  X: ROCK,
  Y: PAPER,
  Z: SCISSORS
}

const playsScores = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3
}

const roundScore = {
  LOST: 0,
  DRAW: 3,
  WON: 6
}

const defeats = {
  ROCK: SCISSORS,
  PAPER: ROCK,
  SCISSORS: PAPER
}

let totalScore = 0

const getRoundOutcome = (myShape, opShape) => {
  if (myShape === opShape) return DRAW
  if (defeats[myShape] === opShape) return WON
  return LOST
}

const getMyScore = (myShape, opShape) => {
  const myScore = playsScores[myShape]
  if (getRoundOutcome(myShape, opShape) === WON) return myScore + roundScore[WON]
  if (getRoundOutcome(myShape, opShape) === LOST) return myScore + roundScore[LOST]
  return myScore + roundScore[DRAW]
}

const calculateScoreRoundStream = new Writable({
  write (chunk, enc, cb) {
    const rounds = chunk.toString().split('\n')
    totalScore += rounds.reduce((acc, round) => {
      const roundShapes = round.split(' ')
      const opShape = opponentsPlay[roundShapes[0]]
      const myShape = myPlay[roundShapes[1]]

      return acc + getMyScore(myShape, opShape)
    }, 0)
    cb()
  }
})

pipeline(
  fs.createReadStream('./input.txt', { encoding: 'utf8' }),
  calculateScoreRoundStream,
  (err) => err ? console.error(err) : console.log(totalScore)
)
