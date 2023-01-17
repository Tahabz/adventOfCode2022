const { Transform, pipeline, Writable } = require('node:stream')
const fs = require('fs')

let greatestSum = 0

const blankLineSplitter = new Transform({
  objectMode: true,
  transform (chunk, enc, cb) {
    chunk.toString()
      .split('\n\n')
      .map(str => str.split('\n'))
      .forEach(arr => this.push(arr))
    cb()
  }
})

const sumLines = new Writable({
  objectMode: true,
  write (chunk, enc, cb) {
    const sum = chunk.reduce((a, c) => a + Number(c), 0)
    greatestSum = sum > greatestSum ? sum : greatestSum
    cb()
  }
})

pipeline(
  fs.createReadStream('./input.txt'),
  blankLineSplitter,
  sumLines,
  (err) => {
    if (err) console.error(err)
    else console.log(greatestSum)
  }
)
