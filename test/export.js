var rocket = require('./../index')

module.exports = rocket('Testing google', async function(t) {
  res = await fetch('https://www.google.com')
  var condition = res.timings.duration < 300
  t.deepEqual(condition, true, `${res.duration} is greater than 300`)
  t.end()
})