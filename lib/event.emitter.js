'use strict'

var socketmanager = require('./socket.manager')
  , _ = require('underscore')

module.exports = EventEmitter
module.exports.CLIENT = 'client'
module.exports.SERVER = 'server'

function EventEmitter(opts, socket) {
    opts = opts || {}

    this.namespace = opts.namespace
    this.room = opts.room
    this.compressed = opts.compressed || true
    this.direction = opts.direction || module.exports.CLIENT
    this.sockets = null
    this.fromSocket = socket || null
}

EventEmitter.prototype.to = function(roomKey) {
    this.room = roomKey
    return this
}

EventEmitter.prototype.toDirection = function(direction) {
    this.direction = direction
    return this
}

EventEmitter.prototype.in = function(namespace) {
    // in namespace
    this.namespace = namespace
    return this
}

EventEmitter.prototype.emit = function(eventKey, payload, ack) {
    if (this.chainedSocket) {
        this.sockets = [this.chainedSocket]
    }
    else {
        this.sockets = socketmanager.getSockets(this.namespace)
    }

    var self = this
    this.sockets.forEach(function(socket) {
        if (socket.joinedRooms.indexOf(self.room) == -1) { return true }
        
        switch(self.direction) {
            case module.exports.CLIENT:
                socket.client.fireEvent(eventKey, payload, ack)
                break;
            case module.exports.SERVER:
                socket.fireEvent(eventKey, payload, ack)
                break;
        }
    })
}

EventEmitter.prototype._parse = function(input) {
    return JSON.parse(JSON.stringify(input))
}
