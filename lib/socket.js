'use strict'

var microtime = require('microtime')


module.exports = Socket

function Socket(client) {
    this.client = client
    this.eventCallbacks = {}
    this.joinedRooms = []

    var id = microtime.now()
    this.id = id
    this.client.id = id
}

Socket.prototype.emit = function(eventKey, eventPayload, ack) {
    this.client.fireEvent(eventKey, eventPayload, ack)
}

Socket.prototype.on = function(eventKey, callback) {
    if (!this.eventCallbacks[eventKey] instanceof Array) {
        this.eventCallbacks[eventKey] = []
    }
    this.eventCallbacks[eventKey].push(callback)
}

Socket.prototype.fireEvent = function(eventKey, eventPayload, ack) {
    if (this.eventCallbacks[eventKey] instanceof Array) {
        this.eventCallbacks.foreach(function(callback) {
            callback(eventPayload, ack)
        })
    }
}

Socket.prototype.join = function(roomKey) {
    this.joinedRooms.push(roomKey)
    return this
}

Socket.prototype.leave = function(roomKey) {
    this.joinedRooms.splice(roomKey)
    return this
}
