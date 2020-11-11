process.on('message', async function(message) {
  var file = message.file
  var module = require(file)
  var plugins = require('./plugins')
  var iterations = [...Array(message.iterations).keys()]

  plugins.onInit()

  var promises = iterations.map(function(_) {
    return new Promise(function(resolve, _) {
      module(resolve, output, plugins)
    })
  })

  await Promise.all(promises)
  
  process.send('done')
  process.exit(0)

})

function output(data) {
  process.send(data)
}