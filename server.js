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

io.on('connection', (socket) => {
  console.log('a user connected')
})

server.listen(8080, () => {
  console.log('listening on *:8080')
})
