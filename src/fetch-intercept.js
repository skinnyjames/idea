const EventEmitter = require('events').EventEmitter
const inherits = require('inherits')

inherits(Interceptor, EventEmitter)

function Interceptor(config) {
    this.config = config
}

Interceptor.prototype.register = function(config) {
    this.config = config
    this.store = {}
    this.requests = {}
    this.responses = {}
}

Interceptor.prototype.requestHandler = function(id, ...req) {
    var store = { start: new Date() } 
    if (this.config.request) {
        [req, store] = this.config.request(req, store)
        this.emit(`request-${id}`, { id, request: req, store })
    }
    return [req, store]
}

Interceptor.prototype.responseHandler = function(id, res, store) {
    store.end = new Date()
    store.duration = (store.end - store.start)
    if (this.config.response) {
        [res, store] = this.config.response(res, store) 
        this.emit(`response-${id}`, { id, response: res, store })

    }
    return [res, store]
}

Interceptor.prototype.unsubscribe = function(id) {
}

function wrappedFetch(fetch, id) {
    return async function newFetch(...args) {
        return execFetch(fetch, id,  ...args)
    }
}

var interceptor = new Interceptor()

async function execFetch(fetch, id, ...args) {
    req = await Promise.resolve(args)
    var [req, store] = interceptor.requestHandler(id, ...args)
    var res = await fetch(...req)
    var [res, store] = interceptor.responseHandler(id, res, store)

    return res
}


module.exports = function() {
    var fetch = require('node-fetch')

    return {
        getFetch: (id) => { return wrappedFetch(fetch, id) },
        interceptor: interceptor
    }
}