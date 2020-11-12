var rocket = require('./../index')

module.exports = rocket('Testing google', async function(t) {
  res = await this.fetch('https://www.google.com')
  res2 = await this.fetch('https://www.yahoo.com')
  var condition = res.timings.duration < 1000
  t.deepEqual(condition, true, `${res.duration} is greater than 300`)
  t.end()
})