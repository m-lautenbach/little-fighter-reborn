import iceServers from './iceServers'

export default (id, socket) => {
  const connection = new RTCPeerConnection({ iceServers })

  connection.ondatachannel = ({ channel }) => {
    console.debug('open channel to lead')
    channel.onmessage = ({ data }) => console.log(`received message: ${data}`)
    channel.onopen = () => channel.send(`message from peer ${id}`)
  }

  socket.on('ice candidate',
    async (evt) => connection.addIceCandidate(evt.candidate),
  )
  connection.onicecandidate = ({ candidate }) => {
    if (candidate) {
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
