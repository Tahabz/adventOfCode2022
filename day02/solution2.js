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

const decisions = {
  X: LOST,
  Y: DRAW,
  Z: WON
}

let totalScore = 0

const calculateScoreRoundStream = new Writable({
  write (chunk, enc, cb) {
    const rounds = chunk.toString().split('\n')
    totalScore += rounds.reduce((acc, round) => {
      const roundInputs = round.split(' ')
      const opShape = opponentsPlay[roundInputs[0]]
      const roundRes = roundInputs[1]
      const myShape = getMyShape(roundRes, opShape)

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
  return myScore + getRoundScore(myShape, opShape)
}

const getRoundScore = (myShape, opShape) => {
  if (myShape === opShape) return roundScore[DRAW]
  if (defeats[myShape] === opShape) return roundScore[WON]
  return roundScore[LOST]
}

const getMyShape = (roundRes, opShape) => {
  if (decisions[roundRes] === LOST) return defeats[opShape]
  if (decisions[roundRes] === DRAW) return opShape
  return getWinningShape(opShape)
}

const getWinningShape = (shape) => defeats[defeats[shape]]
