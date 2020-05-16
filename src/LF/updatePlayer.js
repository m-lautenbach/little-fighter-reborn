import state from './state'
import updateDirection from './updateDirection'
import updateAnimation from './updateAnimation'
import peers from './netcode/peers'

export default () => {
  const { player } = state
  updateAnimation(player.animation)
  updateDirection(player)
  console.log(peers)
  Object.values(peers).forEach(({ channel }) =>
    channel && channel.send(JSON.stringify({ type: 'update', actor: player })),
  )
}
