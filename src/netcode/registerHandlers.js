import iceServers from './iceServers'
import peers from './peers'
import handleMessage from './handleMessage'

import updatePlayer from '../updatePlayer'
import handleClosing from './handleClosing'
import handleDisconnect from './handleDisconnect'

export default (socket) => {
  // handle ice candidate from remote
  socket.on('ice candidate', async ({ from, candidate }) => {
    console.debug(`received ice candidate from ${from}`)
    peers[from] && await peers[from].connection.addIceCandidate(candidate)
  })

  // Handlers when initiating connection
  socket.on('answer', async ({ from, answer }) => {
    console.debug(`received answer from ${from}`)
    peers[from] && await peers[from].connection.setRemoteDescription(answer)
  })

  socket.on('new peer', async ({ id: peerId, name }) => {
    console.debug(`discovered new peer: ${peerId}`)
    const connection = new RTCPeerConnection({ iceServers })

    const channel = connection.createDataChannel('dataChannel')
    console.debug(`creating new channel to ${peerId}`)

    peers[peerId] = { id: peerId, connection, channel, name }
    handleClosing(peerId)

    channel.onmessage = ({ data }) => handleMessage({ id: peerId, name }, JSON.parse(data))

    channel.onopen = () => {
      handleDisconnect(peerId)
      console.debug(`channel to ${peerId} opened`)
      updatePlayer()
    }

    connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        console.debug(`sending ice candidate to ${peerId}`)
        socket.emit('ice candidate', {
          to: peerId,
          candidate,
        })
      } else {
        console.debug(`finished ice candidate search for ${peerId}`)
      }
    }

    const offer = await connection.createOffer()
    await connection.setLocalDescription(offer)

    console.debug(`sending offer to ${peerId}`)
    socket.emit('offer', { to: peerId, offer })
  })

  // handlers for reacting to connection initiation
  socket.on('offer', async ({ from, offer, name }) => {
    console.debug(`received offer from ${from}`)
    const connection = new RTCPeerConnection({ iceServers })

    peers[from] = { id: from, name, connection }
    handleClosing(from)

    // handle datachannel from remote
    connection.ondatachannel = ({ channel }) => {
      console.debug(`received data channel from ${from}`)
      if (peers[from]) {
        peers[from].channel = channel
        channel.onmessage = ({ data }) => handleMessage({ id: from, name }, JSON.parse(data))

        // handle opening of datachannel after ice negotiation
        channel.onopen = () => {
          handleDisconnect(from)
          console.debug(`channel to ${from} opened`)
          peers[from] = { channel }
          updatePlayer()
        }
      }
    }

    // send found ice candidate to remote
    // null means candidate search concluded
    connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        console.debug(`sending ice candidate to ${from}`)
        socket.emit('ice candidate', {
          to: from,
          candidate,
        })
      } else {
        console.debug(`finished ice candidate search for ${from}`)
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
