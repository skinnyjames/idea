var Test = require('./src/test')
var uuid = require('uuid')
var fetchIntercept = require('./src/fetch-intercept')
var { getFetch, interceptor } = fetchIntercept()

interceptor.register({
  request: function(req, store) {
    store.url = req[0]
    return [req, store]
  },
  response: function(response, store) {
      response.timings = { url: store.url, start: store.start, end: store.end, duration: store.duration}
      return [response, store]
  }
})

module.exports = function(name, cb) {
  return async function(resolve, output) {

    var id = uuid.v4()
    var fetch = getFetch(id)

    const results = {
      expectations: [],
      timings: []
    }
    
    interceptor.on(`response-${id}`, responseHandler)

    var t = new Test(name)

    t.on('result', function(result) {
      results.expectations.push(result)
    })

    t.on('end', function() {
      interceptor.removeListener(`response-${id}`, responseHandler)
      output(results)
      resolve()
    })

    return cb.bind({ fetch })(t)

    function responseHandler(payload) {
      results.timings.push(payload.store)
    }
   
  }
}
