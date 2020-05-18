import state from './state'
import updateDirection from './updateDirection'
import updateAnimation from './updateAnimation'
import peers from './netcode/peers'

export default () => {
  const { player } = state
  updateAnimation(player.animation)
  updateDirection(player)
  Object.values(peers).forEach(({ channel, connection }) => {
    if (channel && connection.connectionState === 'connected')
      channel && channel.send(JSON.stringify({ type: 'update', actor: player }))
  })
}
