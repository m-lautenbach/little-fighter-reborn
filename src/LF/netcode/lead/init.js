import iceServers from '../iceServers'
import channels from '../channels'
import handleMessage from '../handleMessage'
import updatePlayer from '../../updatePlayer'

export default (id, socket) => {
  const peers = {}

  socket.on('ice candidate',
    ({ from, candidate }) => peers[from].connection.addIceCandidate(candidate),
  )

  socket.on('description', async ({ from, answer }) => {
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
      channels.push(channel)
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
    socket.emit('description', { to: id, offer })
  })
}
