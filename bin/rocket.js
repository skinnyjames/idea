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
.option('file', {
  alias: 'f',
  type: 'string',
  description: 'file with test',
  //required: true
})
.argv

var processes = options.processes || 1
var iterations = options.iterations || 3
var splitIterations = Math.ceil((iterations / processes))
var forkPath = `${__dirname}/../fork.js`
var test = './test/export' //path.resolve(options.file)

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
.then(function() {

})