'use strict'

var socketmanager = require('./lib/socket.manager')
  , Socket = require('./lib/socket')

module.exports = function(ioUrl, ioOptions) {
    var client = new Client()
    var socket = new Socket(client)
    socketmanager.addSocket(socket)

    return client
}


function Client(ioUrl, ioOptions) {
    this.eventCallbacks = {}
    this.disconnected = false
    this.connected = false

    // Self referencing
    var self = this
    setTimeout(function() {
        self._connect()
    }, 50)
}

Client.prototype._connect = function() {
    this.connected = true
    this.disconnected = false
    this.fireEvent('connect')
}

Client.prototype.on = function(eventKey, callback) {
    if (typeof this.eventCallbacks[eventKey] == 'undefined') {
        this.eventCallbacks[eventKey] = []
    }

    this.eventCallbacks[eventKey].push(callback)
}

Client.prototype.fireEvent = function(eventKey, eventPayload, ack) {
    if (this.eventCallbacks[eventKey] instanceof Array) {
        this.eventCallbacks[eventKey].forEach(function(callback) {
            callback(eventPayload, ack)
        })
    }
}

Client.prototype.disconnect = function() {
    this.disconnected = true
    this.fireEvent('disconnect')
}

