import io from 'socket.io-client'
import { v4 as uuid } from 'uuid'
import initLead from './initLead'
import initPeer from './initPeer'

export default () => {
  const id = uuid()
  const socket = io()

  // random delay, first becomes lead
  setTimeout(
    () => {
      socket.emit('register', id)
      socket.on('role assigned', msg => {
        console.log(`player ${id} became ${msg.role}`)
        ;(msg.role === 'lead' ? initLead : initPeer)(id, socket)      })
    },
    Math.random() * 200,
  )
}
