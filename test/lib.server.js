var should = require('chai').should()
  , expect = require('chai').expect
  , Server = require('..')
  , io = require('../client')



describe('Lib: Socket Mock', function(){
  it('Should expose an server by requiring it', function(done) {
    server = require('..')()

    expect(server).to.be.an.instanceof(Server);
    done()
  }),

  it('Should accept a middleware in the `use` function', function(done) {
    expect(server).to.respondTo('use')
    done()
  })

  it('Should fire `connection` when new socket comes in', function(done) {
    server = new Server()

    server.on('connection', function(socket) {
      expect(socket).to.be.an.instanceof(require('../lib/socket'))
      done()
      server.close()
    })
    socket = io()
  })
})