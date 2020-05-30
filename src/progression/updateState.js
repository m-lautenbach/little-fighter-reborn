import { clamp } from 'ramda'

import state from '../state'
import progressAnimation from './progressAnimation'
import updatePhysics from '../netcode/updatePhysics'
import getAllActors from '../getAllActors'

let forward = true

export default () => {
  const newTimestamp = Date.now()
  const passedSeconds = (newTimestamp - state.timestamp) / 1000
  forward = (state.camera.x > state.camera.xMax) ? false : state.camera.x <= 0 && true || forward

  state.timestamp = newTimestamp
  state.frame++

  const { player, camera, rendering } = state
  const actors = getAllActors()

  actors.forEach(
    actor => {
      progressAnimation(actor, newTimestamp)
      updatePhysics(actor, passedSeconds)
    },
  )

  const cameraMargin = .3
  camera.x = clamp(
    player.position.x - (1 - cameraMargin) * rendering.width,
    Math.max(0, player.position.x - cameraMargin * rendering.width),
    camera.x,
  )
  camera.x = clamp(
    0,
    camera.x,
    camera.xMax,
  )
}
