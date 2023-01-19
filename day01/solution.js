const { Transform, pipeline, Writable } = require('node:stream')
const fs = require('fs')

let top1 = 0
let top2 = 0
let top3 = 0

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
    if (sum > top1) {
      top3 = top2
      top2 = top1
      top1 = sum
    } else if (sum > top2) {
      top3 = top2
      top2 = sum
    } else if (sum > top3) {
      top3 = sum
    }
    cb()
  }
})

pipeline(
  fs.createReadStream('./input.txt'),
  blankLineSplitter,
  sumLines,
  (err) => {
    if (err) console.error(err)
    else {
      console.log(`Top 1: ${top1}`)
      console.log(`Total of Top 3: ${top1 + top2 + top3}`)
    }
  }
)
