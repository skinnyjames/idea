var collection = require('./src/fetch-intercept')()
var uuid = require('uuid')

function FetchInterceptPlugin() {
}

FetchInterceptPlugin.prototype.onInit = function onInit() {  
    collection.init({
        request: function(req) {
            this.url = req[0]
            this.startTime = new Date()
            return req
        },
        response: function(response) {
            this.endTime = new Date()
            this.duration = (this.endTime - this.startTime)
            response.timings = { url: this.url, duration: this.duration}
            return response
        }
    })
}

FetchInterceptPlugin.prototype.onSetup = function onSetup(results) {
    timings = []
    id = uuid.v4()
    collection.register(id)

    collection.on('response', function(payload) {
        if (payload.id === results.fetch.id) {
            results.timings.push(payload.res.timings)
        }
    })
    results.fetch = {
        id,
        collection
    }
    results.timings = timings
    return results
}

FetchInterceptPlugin.prototype.onEnd = function onEnd(results) {
    collection.unsubscribe(results.fetch.id)
    return results
}


function PluginsCollection() {
    this.plugins = []
}

PluginsCollection.prototype.register = function register(plugin) {
    this.plugins.push(plugin)
}

PluginsCollection.prototype.onInit = function onInit() {
    this.plugins.forEach(function(plugin) {
        if (plugin.onInit) {
            plugin.onInit()
        }
    })
}

PluginsCollection.prototype.onSetup = function onSetup(results) {
    this.plugins.forEach(function(plugin) {
        if (plugin.onSetup) {
            res = plugin.onSetup(results)
        }
    })
    return res
}

PluginsCollection.prototype.onResult = function onResult(res) {
    this.plugins.forEach(function(plugin) {
        if (plugin.onResult) { 
            res = plugin.onResult(res)
        }
    })
    return res
}

PluginsCollection.prototype.onEnd = function onEnd(results) {
    this.plugins.forEach(function(plugin) {
        if (plugin.onEnd) {
            res = plugin.onEnd(results)
        }
    })
    return res
}



const plugins = new PluginsCollection()
const interceptPlugin = new FetchInterceptPlugin()
plugins.register(interceptPlugin)

module.exports = plugins