const express = require('express')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

if (process.env.MODE === 'dev') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')

  const config = require('./webpack.dev.js')
  const compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }))
} else {
  app.use(express.static('dist'))
}

const peers = {}
let playerIndex = 0

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('register', ({ id }) => {
    const name = `P${playerIndex++}`
    Object.values(peers).forEach(
      ({ socket }) => socket.emit('new peer', { id, name }),
    )
    peers[id] = { id, socket, name }

    ;['ice candidate', 'offer', 'answer'].forEach(evt =>
      socket.on(evt, ({ to, ...args }) =>
        peers[to] && peers[to].socket.emit(evt, { from: id, name, ...args }),
      ))

    socket.on('disconnect', () => {
      console.log(`user ${id} disconnected`)
      delete peers[id]
    })
  })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
