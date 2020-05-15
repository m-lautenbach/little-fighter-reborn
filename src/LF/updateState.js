import { clamp } from 'ramda'

import state from './state'
import progressAnimation from './progressAnimation'

let forward = true

export default () => {
  const newTimestamp = Date.now()
  const passedSeconds = (newTimestamp - state.timestamp) / 1000
  forward = (state.camera.x > state.camera.xMax) ? false : state.camera.x <= 0 && true || forward

  state.timestamp = newTimestamp
  state.frame++

  const { world: { boundaries: { yMin, yMax }, gravity }, player } = state
  progressAnimation(player.animation)

  player.velocity.z += passedSeconds * gravity

  player.position.x = Math.max(0, player.position.x + passedSeconds * player.velocity.x)
  player.position.y = clamp(yMin, yMax, player.position.y + passedSeconds * player.velocity.y)
  player.position.z = Math.max(0, player.position.z + passedSeconds * player.velocity.z)

  if (player.position.z === 0) {
    player.velocity.z = 0
  }
}
