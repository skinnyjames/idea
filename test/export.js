var rocket = require('./../index')

module.exports = rocket('Testing google', function(t) {
  t.deepEqual(1,1, 'hello')
  t.end()
})