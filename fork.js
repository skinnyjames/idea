process.on('message', async function(message) {
  var file = message.file
  var module = require(file)
  var iterativeChunks = (message.iterations > message.chunks) ? Math.round((message.iterations / message.chunks)) : 1

  for(let i=0; i < iterativeChunks; i++) {
    var promises = [...Array(message.chunks).keys()].map(function(_) {
      return new Promise(function(resolve, _) {
        module(resolve, output)
      })
    })
    await Promise.all(promises)
  }

  process.send('done')
  process.exit(0)
})

function output(data) {
  process.send(data)
}