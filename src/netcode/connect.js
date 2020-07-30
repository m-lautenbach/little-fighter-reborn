import io from 'socket.io-client'
import { v4 as uuid } from 'uuid'
import { operation } from 'retry'

import registerHandlers from './registerHandlers'

export default () => {
  const id = uuid()
  const connectToSocketIoServer = operation()
  connectToSocketIoServer.attempt(() => {
    try {
      let socket = io('https://gentle-mountain-79659.herokuapp.com')

      socket.emit('register', { id })
      console.debug(`I am ${id}`)
      registerHandlers(socket)
    } catch (ex) {
      operation.retry(ex)
    }
  })
}
