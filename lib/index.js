'use strict'

var sockets = require('./socket.manager')
  , EventEmitter = require('./event.emitter')


module.exports = exports = Server

function Server(srv, opts) {
    if (!(this instanceof Server)) return new Server(srv, opts);

    opts = opts || {}

    this.adapter = null
    this.path = opts.path
    this.adapter = null
    this.middleware = []
    this.eventCallbacks = {}

    // assign yourself to the manager
    sockets.setServer(this)
}

Server.prototype.path = function(path) {
    if (!path) {
        return this.path
    }

    this.path = path
    return this
}

Server.prototype.sockets = function(namespace) {
    return sockets.getSockets(namespace)
}

Server.prototype.adapter = function(adapter) {
    if (!adapter) { 
        return this.adapter 
    }

    this.adapter = adapter
    return this
}

Server.prototype.use = function(middleware) {
    this.middleware.push(middleware)
    return this
}

Server.prototype.on = function(eventKey, callback) {
    if (typeof this.eventCallbacks[eventKey] == 'undefined') {
        this.eventCallbacks[eventKey] = []
    }

    this.eventCallbacks[eventKey].push(callback)

    return this
}

Server.prototype.to = function(roomKey) {
    var eventEmitter = new EventEmitter()
    return eventEmitter.toDirection(EventEmitter.CLIENT).to(roomKey)
}

Server.prototype.close = function() {
    sockets.setServer(null)
}

Server.prototype.fireEvent = function(eventKey, eventPayload) {
    if (this.eventCallbacks[eventKey] instanceof Array) {
        this.eventCallbacks[eventKey].forEach(function(callback) {
            callback(eventPayload)
        })
    }
}