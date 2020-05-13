import io from 'socket.io-client'
import { v4 as uuid } from 'uuid'

export const connect = () => {
  const id = uuid()
  const peers = {}
  let role

  const socket = io()

  // random delay, first becomes host
  setTimeout(
    () => {
      socket.emit('register', id)
      socket.on('role assigned', msg => {
        role = msg.role
        console.log(`player ${id} became ${role}`)
        if (role === 'lead') {
          socket.on('new peer',
            ({ id }) => {
              peers[id] = {}
            },
          )
        }
      })
    },
    Math.random() * 200,
  )
}
