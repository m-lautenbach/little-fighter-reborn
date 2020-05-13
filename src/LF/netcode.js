import io from 'socket.io-client'
import { v4 as uuid } from 'uuid'

const leadInit = (id, socket, connection) => {
  const peers = {}

  socket.on('new peer', async ({ id }) => {
    peers[id] = {}

    const channel = connection.createDataChannel('dataChannel')
    channel.onmessage = ({ data }) => console.log(`received message: ${data}`)

    channel.onopen = () => {
      channel.send('message from lead')
    }

    connection.onicecandidate = ({ candidate }) => {
      if (candidate === null) {
        console.log('finished ice candidate search')
      } else {
        console.log('sending ice candidate ', candidate, ' to ', id)
        socket.emit('ice candidate', {
          to: id,
          candidate,
        })
      }
    }

    socket.on('description', ({ answer }) => {
      connection.setRemoteDescription(answer)
    })

    const offer = await connection.createOffer()
    await connection.setLocalDescription(offer)
    socket.emit('description', { to: id, offer })
  })
}

const peerInit = (id, socket, connection) => {
  connection.ondatachannel = ({ channel }) => {
    console.log('open channel to lead')
    channel.onmessage = ({ data }) => console.log(`received message: ${data}`)
    channel.send(`message from peer ${id}`)
  }

  connection.onicecandidate = ({ candidate }) => {
    if (candidate === null) {
      console.log('finished ice candidate search')
    } else {
      console.log('sending ice candidate ', candidate, ' to lead')
      socket.emit('ice candidate', { candidate })
    }
  }

  socket.on('description', async ({ offer }) => {
    await connection.setRemoteDescription(offer)
    const answer = await connection.createAnswer()
    await connection.setLocalDescription(answer)
    socket.emit('description', { answer })
  })
}

export const connect = () => {
  const id = uuid()
  const socket = io()
  const connection = new RTCPeerConnection()
  socket.on('ice candidate',
    async (evt) => {
      try {
        console.log('received ice candidate', evt)
        await connection.addIceCandidate(evt.candidate)
      } catch (ex) {
        console.error(ex)
      }
    },
  )

  // random delay, first becomes host
  setTimeout(
    () => {
      socket.emit('register', id)
      socket.on('role assigned', msg => {
        console.log(`player ${id} became ${msg.role}`)
        ;(msg.role === 'lead' ? leadInit : peerInit)(id, socket, connection)
      })
    },
    Math.random() * 200,
  )
}
