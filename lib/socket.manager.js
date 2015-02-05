'use strict'

var microtime = require('microtime')
  , sockets = {}
  , server

  exports.sockets = {}

/**
 * Set a server that will be managed
 * @param {Server} srv -- the server object
 */
exports.setServer = function(srv) {
    server = srv
}

/**
 * Get the sockets in a given namespace (if none namespace is given `/`)
 * @param  {String} namespace -- The namespace (default: `/`)
 * @return {Array}            -- Sockets
 */
exports.getSockets = function(namespace) {
    if (namespace === undefined) { namespace = '/' }

    if (sockets[namespace] !== undefined) {
        return sockets[namespace]
    }

    // return an empty array
    return []
}

/**
 * Add a socket to a given array
 * @param {Socket} socket    -- the socket server client
 * @param {String} namespace -- the namespace
 */
exports.addSocket = function(socket, namespace) {
    if (namespace === undefined) { namespace = '/' }

    if (sockets[namespace] instanceof Array) {
        sockets[namespace].push(socket)
    }
    else {
        sockets[namespace] = []
        sockets[namespace].push(socket)
    }
    exports.sockets[socket.id] = socket

    // Mimic the connection of a client on the server
    setTimeout(function() {
        if (server) {
            server.fireEvent('connection', socket)
        }
    }, 50)
    
}
