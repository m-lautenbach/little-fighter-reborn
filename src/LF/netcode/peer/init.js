import iceServers from '../iceServers'
import peers from '../peers'
import handleMessage from '../handleMessage'
import updatePlayer from '../../updatePlayer'

export default (id, socket) => {
  const connection = new RTCPeerConnection({ iceServers })

  // handle ice candidate from remote
  socket.on('ice candidate',
    async (evt) => connection.addIceCandidate(evt.candidate),
  )

  // handling incoming offer
  // this starts channel initiation for new peer
  socket.on('offer', async ({ from, offer }) => {

    // handle datachannel from remote
    connection.ondatachannel = ({ channel }) => {
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
