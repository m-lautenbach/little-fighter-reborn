import state from './state'
import updateDirection from './updateDirection'
import updateAnimation from './updateAnimation'
import peers from './netcode/peers'

export default () => {
  const { player } = state
  updateAnimation(player.animation)
  updateDirection(player)
  Object.values(peers).forEach(({ channel }) => {
    try {
      channel.send(JSON.stringify({ type: 'update', actor: player }))
    } catch (ex) {
      // ignore, as we are handling broken connections elsewhere
    }
  })
}
