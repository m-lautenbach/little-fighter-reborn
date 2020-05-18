import peers from './peers'
import state from '../state'

export default peerId => {
  const { connection, channel } = peers[peerId]
  const cleanPeer = () => {
    delete state.remotes[peerId]
    delete peers[peerId]
  }

  channel.onclose = cleanPeer
  connection.onconnectionstatechange = () => {
    console.debug(`connection state to ${peerId} changed: ${connection.connectionState}`)
    if (['disconnected', 'failed', 'closed'].includes(connection.connectionState)) {
      cleanPeer()
    }
  }
}
