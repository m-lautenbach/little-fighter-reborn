import { clamp } from 'ramda'

import state from '../state'

export default (actor, passedSeconds) => {
  const { world: { boundaries: { yMin, yMax }, gravity } } = state

  actor.velocity = actor.velocity || { x: 0, y: 0, z: 0 }
  actor.velocity.z += passedSeconds * gravity

  actor.position.x = Math.max(0, actor.position.x + passedSeconds * actor.velocity.x)
  actor.position.y = clamp(yMin, yMax, actor.position.y + passedSeconds * actor.velocity.y)
  actor.position.z = Math.max(0, actor.position.z + passedSeconds * actor.velocity.z)

  if (actor.position.z === 0) {
    actor.velocity.z = 0
  }
}
