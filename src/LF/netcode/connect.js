import io from 'socket.io-client'
import { v4 as uuid } from 'uuid'
import initLead from './lead/init'
import initPeer from './peer/init'

export default () => {
  const id = uuid()
  const socket = io()

  socket.emit('register', { id })
  socket.on('role assigned', async ({ role }) => {
    console.log(`player ${id} became ${role}`)
    ;(role === 'lead' ? initLead : initPeer)(id, socket)
  })
}
