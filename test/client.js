var should = require('chai').should()
  , expect = require('chai').expect
  , Server = require('..')
  , io = require('../client')
  , server
  , client



describe('Client', function(){
  beforeEach(function(done) {
    server = new Server()

    client = io()
    done()
  })
  afterEach(function(done) {
    server.close()
    done()
  })
  it('Should expose a function', function(done) {
    done()
  })
  it('Should receive an `connection` event when connected', function(done) {
    client.on('connect', function() {
      client.connected.should.be.ok()
      done()
    })
  })
  it('Should receive an `disconnect` event when disconnected', function(done) {
    client.on('connect', function() {
      client.disconnect()
    })
    client.on('disconnect', function() {
      done()
    })
  })
  it('Should receive an message event when server sends message', function(done) {
    client.on('hello', function(world) {
      world.should.be.equal('world')
      done()
    })

    server.on('connection', function(socket) {
      socket.emit('hello', 'world')
    })
  })
  describe('Rooms', function() {
    it('Should be able to join a room', function(done) {
      server.on('connection', function(socket) {
        socket.join('room')
        done()
      })
    })
    it('Should receive an message from the room when joined', function(done) {
      server.on('connection', function(socket) {
        socket.join('room')

        server.to('room').emit('hello', 'world')
      })

      client.on('hello', function(payload) {
        payload.should.be.equal('world')
        done()
      })
    })
    it('Other clients shouldn\'t receive the message when they didn\'t join the room', function(done) {
      client2 = io()

      server.on('connection')

      client2.on('connect', function() {

      })
    })
  })
  
})