import state from './state'
import updateDirection from './updateDirection'
import updateAnimation from './updateAnimation'
import channels from './netcode/channels'

export default () => {
  const { player } = state
  updateAnimation(player.animation)
  updateDirection(player)
  channels.forEach(channel => channel.send(JSON.stringify({ type: 'update', actor: player })))
}
