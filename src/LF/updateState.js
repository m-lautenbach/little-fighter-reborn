import { clamp } from 'ramda'

import updateAnimation from './updateAnimation'
import updateDirection from './updateDirection'
import state from './state'

let forward = true

export default () => {
  const newTimestamp = Date.now()
  const passedSeconds = (newTimestamp - state.timestamp) / 1000
  forward = (state.camera.x > state.camera.xMax) ? false : state.camera.x <= 0 && true || forward

  state.timestamp = newTimestamp
  state.frame++
  state.actors.forEach(
    actor => {
      updateAnimation(actor.animation)
      updateDirection(actor)
      const { world: { boundaries: { yMin, yMax }, gravity } } = state
      actor.velocity.z += passedSeconds * gravity

      actor.position.x = Math.max(0, actor.position.x + passedSeconds * actor.velocity.x)
      actor.position.y = clamp(yMin, yMax, actor.position.y + passedSeconds * actor.velocity.y)
      actor.position.z = Math.max(0, actor.position.z + passedSeconds * actor.velocity.z)

      if (actor.position.z === 0) {
        actor.velocity.z = 0
      }
    },
  )
}
