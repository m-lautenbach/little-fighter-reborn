import state from './state'
import progressAnimation from './progressAnimation'
import updatePhysics from './netcode/updatePhysics'

let forward = true

export default () => {
  const newTimestamp = Date.now()
  const passedSeconds = (newTimestamp - state.timestamp) / 1000
  forward = (state.camera.x > state.camera.xMax) ? false : state.camera.x <= 0 && true || forward

  state.timestamp = newTimestamp
  state.frame++

  const { player } = state
  progressAnimation(player.animation)
  updatePhysics(player, passedSeconds)
}