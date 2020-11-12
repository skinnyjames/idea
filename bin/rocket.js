const process = require('process')
var yargs = require('yargs')(process.argv.slice(2))
var fork = require('child_process').fork
var path = require('path')
var options = yargs
.usage('$0 -i number -p number -f string')
.option('iterations', {
  alias: 'i',
  type: 'number',
  description: 'Number of iterations',
  //required: true
})
.option('processes', {
  alias: 'p',
  type: 'number', 
  description: 'Number of parallel processes',
  //required: true
})
.options('chunks', {
  alias: 'c',
  type: 'number',
  description: 'Chunk Size'
})
.option('file', {
  alias: 'f',
  type: 'string',
  description: 'file with test',
  //required: true
})
.argv

var processes = options.processes || 1
var iterations = options.iterations || 10
var chunks = options.chunks || 2
var splitIterations = Math.ceil((iterations / processes))

if (splitIterations < chunks) {
  throw new Error('chunks must be smaller than the split iterations')
}

var forkPath = `${__dirname}/../fork.js`
var test = './test/export' //path.resolve(options.file)

var parray = [...Array(processes).keys()].map(function(i) { return i + 1 })

const durations = []

var promises = parray.map(function(i) {
  return new Promise(function(resolve, _) {
    var module = fork(forkPath)
    module.send({ iterations: splitIterations, chunks: chunks, file: test })

    module.on('message', function(message) {
      if (message === 'done') {
        resolve()
      } else {
        console.log(message)
        durations.push(message.timings[0].duration)
      }
    })
  })
})

Promise.all(promises)
.then(function() {
  console.log(durations)
})