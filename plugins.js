var fetchIntercept = require('./src/fetch-intercept')




// function FetchInterceptPlugin() {
// }

// FetchInterceptPlugin.prototype.onInit = function onInit() {  
//     collection.init({
//         request: function(req) {
//             this.url = req.url 
//             this.startTime = new Date()
//             return req
//         },
//         response: function(response) {
//             this.endTime = new Date()
//             this.duration = (this.endTime - this.startTime)
//             response.timings = { url: this, duration: this.duration}
//             return response
//         }
//     })
// }

// FetchInterceptPlugin.prototype.onSetup = function onSetup(results) {
//     timings = []
//     id = uuid.v4()
//     collection.register(id)
//     collection.on('response', responseEvent(results))
//     results.fetch = {
//         id,
//     }
//     results.timings = timings
//     return results
// }

// FetchInterceptPlugin.prototype.onEnd = function onEnd(results) {
//     collection.unsubscribe(results.fetch.id)
//     const listenerFn = responseEvent(results)
//     console.log(listenerFn)
//     collection.removeListener('response', listenerFn)
//     return results
// }

// function responseEvent(results) {
//     return function responseEventFn(payload) {
//         if (payload.id === results.fetch.id) {
//             results.timings.push(payload.res.timings)
//         }
//     }
// }


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
            results = plugin.onSetup(results)
        }
    })
    return results
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
// const interceptPlugin = new FetchInterceptPlugin()
// plugins.register(interceptPlugin)

module.exports = plugins