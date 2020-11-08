var assert = require('assert')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
inherits(Test, EventEmitter)

function Test(name) {
  this.name = name
  this._assert = assert
}

Test.prototype.end = function() {
  this.emit('end')
}

Test.prototype.deepEqual = function(actual, expected, message) {
  var res = this.tryAssert('deepStrictEqual', actual, expected, message)
  this.emit('result', res)
}

Test.prototype.tryAssert = function (method, ...args) {
  const result = { name: this.name }
  try {
    this._assert[method](...args)
    result.status = 'passed'
  } catch(e) {
    result.code = e.code
    result.message = e.message
    result.status = 'failed'
  }
  return result
}

module.exports = Test