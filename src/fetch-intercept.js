const EventEmitter = require('events').EventEmitter
const { ERANGE } = require('constants')
const inherits = require('inherits')

inherits(InterceptorCollection, EventEmitter)
inherits(Interceptor, EventEmitter)



function InterceptorCollection() {
    this.interceptors = []
}

InterceptorCollection.prototype.unsubscribe = function unsubscribe(id) {
    this.interceptors = this.interceptors.filter(function(i) {
        return i.id !== id
    })
}

InterceptorCollection.prototype.init = function(config) {
    this.config = config
}

InterceptorCollection.prototype.register = function register(id) {
    const interceptor = new Interceptor(id, this.config, this.emit.bind(this))
    this.interceptors.push(interceptor)
    return interceptor
}

InterceptorCollection.prototype.requestHandler =  async function requestHandler(req) {
    if (this.config.request) {
        req = this.config.request(req)
    }
    this.interceptors.forEach(async function(interceptor) {
        interceptor.emitter('request', { id: interceptor.id, req })
    })
    return req
}

InterceptorCollection.prototype.responseHandler = async function responseHandler(res) {
    if (this.config.response) {
        res = this.config.response(res)
    }
    this.interceptors.forEach(async function(interceptor) {
        interceptor.emitter('response', { id: interceptor.id, res })
    })
    return res
}



function Interceptor(id, config, emitter) {
    this.id = id
    this.config = config
    this.emitter = emitter
}

const collection = new InterceptorCollection()

function register(uuid, config) {
    const interceptor = collection.register(uuid, config)
    return interceptor
}

function wrappedFetch(fetch) {
    return async function newFetch(...args) {
        return execFetch(fetch, ...args)
    }
}

async function execFetch(fetch, ...args) {
    req = await Promise.resolve(args)

    req = await collection.requestHandler(req)

    var res = await fetch(...req)

    res  = await collection.responseHandler(res)

    return res
}


module.exports = function() {
    global.fetch ||= require('node-fetch')
    if (!global.fetch) { 
        throw new Error('fetch not found')
    }

    global.fetch = wrappedFetch(global.fetch)

    return collection
}