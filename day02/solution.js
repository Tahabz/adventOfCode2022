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

const getMyScore = (myShape, opShape) => {
  const myScore = playsScores[myShape]
  return myScore + getRoundOutcome(myShape, opShape)
}

const getRoundOutcome = (myShape, opShape) => {
  if (myShape === opShape) return roundScore[DRAW]
  if (defeats[myShape] === opShape) return roundScore[WON]
  return roundScore[LOST]
}
