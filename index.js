var Test = require('./src/test')


module.exports = function(name, cb) {
  return function(resolve, output) {

    var results = {
      expectations: []
    }

    var t = new Test(name)

    t.on('result', function(result) {
      results.expectations.push(result)
    })

    t.on('end', function() {
      output(results)
      resolve()
    })

    cb(t)

  }
}