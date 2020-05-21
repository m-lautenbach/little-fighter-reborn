export default peerId => {
  window.addEventListener('unload', () => {
    const { channel, connection } = peers[peerId]
    try {
      channel.close()
    } catch (ex) {
      // ignore
    }
    try {
      connection.close()
    } catch (ex) {
      // ignore
    }
  })
}
