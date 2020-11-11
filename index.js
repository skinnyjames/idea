var Test = require('./src/test')

module.exports = function(name, cb) {
  return async function(resolve, output, plugins) {

    var results = {
      expectations: []
    }

    results = plugins.onSetup(results)

    var t = new Test(name)

    t.on('result', function(result) {
      results.expectations.push(result)
    })

    t.on('end', function() {
      results = plugins.onEnd(results)
      output(results)
      resolve()
    })

    await cb(t)

  }
}