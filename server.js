const express = require('express')
const app = express()
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const server = require('http').createServer(app)
const io = require('socket.io')(server)

const config = require('./webpack.dev.js')
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}))

const peers = {}
let lead

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('register', (id) => {
    let role
    if (!lead) {
      role = 'lead'
      lead = { id, socket }
    } else {
      role = 'peer'
      peers[id] = { id, socket }
      lead.socket.emit('new peer', { id })
    }

    socket.emit('role assigned', { role })

    ;['ice candidate', 'description'].forEach(evt =>
      socket.on(evt, ({ to, ...args }) =>
        (to ? peers[to].socket : lead.socket).emit(evt, { from: id, ...args }),
      ))

    socket.on('disconnect', () => {
      console.log(`user ${id} disconnected`)
      if (role === 'lead') {
        // TODO: lead migration
        lead = undefined
      } else {
        delete peers[id]
      }
    })
  })
})

server.listen(8080, () => {
  console.log('listening on *:8080')
})
