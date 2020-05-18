import peers from './peers'

export default (peerId) => () => {
  if (!peers[peerId]) {
    return
  }
  const { connection } = peers[peerId]
  console.log(`status of connection to ${peerId} changed: ${connection.connectionState}`)
  if (['disconnected', 'failed', 'closed'].includes(connection.connectionState)) {
    delete state.remotes[peerId]
    delete peers[peerId]
  }
}
