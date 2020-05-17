import iceServers from './iceServers'
import peers from './peers'
import handleMessage from './handleMessage'

import updatePlayer from '../updatePlayer'

export default (id, socket) => {
  // handle ice candidate from remote
  socket.on('ice candidate', ({ from, candidate }) =>
    peers[from].connection.addIceCandidate(candidate),
  )

  // Handlers when initiating connection
  socket.on('answer', async ({ from, answer }) => {
    console.debug(`received answer from ${from}`)
    await peers[from].connection.setRemoteDescription(answer)
  })

  socket.on('new peer', async ({ id }) => {
    const connection = new RTCPeerConnection({ iceServers })

    const channel = connection.createDataChannel('dataChannel')
    console.debug(`creating new channel to peer ${id}`)

    peers[id] = { id, connection, channel }

    channel.onmessage = ({ data }) => handleMessage(peers[id], JSON.parse(data))

    channel.onopen = () => {
      updatePlayer()
    }

    connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('ice candidate', {
          to: id,
          candidate,
        })
      }
    }

    const offer = await connection.createOffer()
    await connection.setLocalDescription(offer)
    socket.emit('offer', { to: id, offer })
  })

  // handlers for reacting to connection innitiation
  socket.on('offer', async ({ from, offer }) => {
    const connection = new RTCPeerConnection({ iceServers })
    peers[from] = { id: from, connection }

    // handle datachannel from remote
    connection.ondatachannel = ({ channel }) => {
      peers[from].channel = channel
      console.debug('open channel to lead')
      channel.onmessage = ({ data }) => handleMessage({ id: 'lead' }, JSON.parse(data))

      // handle opening of datachannel after ice negotiation
      channel.onopen = () => {
        peers[from] = { channel }
        updatePlayer()
      }
    }

    // send found ice candidate to remote
    // null means candidate search concluded
    connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('ice candidate', { to: from, candidate })
      }
    }

    // setup our connection to new peer with descriptions
    await connection.setRemoteDescription(offer)
    const answer = await connection.createAnswer()
    await connection.setLocalDescription(answer)

    // send generated answer to new peer
    socket.emit('answer', { to: from, answer })
  })

}
