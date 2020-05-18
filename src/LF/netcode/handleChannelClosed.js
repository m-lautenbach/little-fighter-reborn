import peers from './peers'

export default (peerId) => () => {
  delete state.remotes[peerId]
  delete peers[peerId]
}
