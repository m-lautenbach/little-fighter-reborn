import state from './state'
import updateDirection from './updateDirection'
import updateAnimation from './updateAnimation'

export default () => {
  const { player } = state
  updateAnimation(player.animation)
  updateDirection(player)
}
