const { measureMemory } = require('vm')
var yargs = require('yargs')
var fork = require('child_process').fork

var options = yargs
.option('iterations', {
  alias: 'i',
  type: 'number',
  description: 'Number of iterations'
})
.option('processes', {
  alias: 'p',
  type: 'number', 
  description: 'Number of parallel processes'
})
.option('file', {
  alias: 'f',
  type: 'string',
  description: 'file with test'
})
.argv

var processes = options.processes || 1
var iterations = options.iterations || 1
var splitIterations = Math.ceil((iterations / processes))
var forkPath = `${__dirname}/../fork.js`
var test = `./test/export.js`

var parray = [...Array(processes).keys()].map(function(i) { return i + 1 })

var promises = parray.map(function(i) {
  return new Promise(function(resolve, _) {
    var module = fork(forkPath)
    module.send({ iterations: splitIterations, file: test })

    module.on('message', function(message) {
      if (message === 'done') {
        resolve()
      } else {
        console.log(message)
      }
    })
  })
})
Promise.all(promises)