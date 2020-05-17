import io from 'socket.io-client'
import { v4 as uuid } from 'uuid'
import initLead from './lead/init'
import initPeer from './peer/init'
import peers from './peers'

export default () => {
  const id = uuid()
  const socket = io()

  // handle ice candidate from remote
  socket.on('ice candidate', ({ from, candidate }) =>
    peers[from].connection.addIceCandidate(candidate),
  )

  socket.emit('register', { id })
  socket.on('role assigned', async ({ role }) => {
    console.log(`player ${id} became ${role}`)
    ;(role === 'lead' ? initLead : initPeer)(id, socket)
  })
}
