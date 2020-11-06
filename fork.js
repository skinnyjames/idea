process.on('message', async function(message) {
  var file = message.file
  var module = require(file)
  var iterations = [...Array(message.iterations).keys()]
  var promises = iterations.map(function(_) {
    return new Promise(function(resolve, reject) {
      module(resolve, output)
    })
  })

  await Promise.all(promises)

  process.send('done')
  process.exit(0)

})

function output(data) {
  process.send(data)
}