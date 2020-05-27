import inputState from '../inputState'
import assetCache from '../assetCache'

export default (actor) => {
  const { KeyW, KeyA, KeyS, KeyD, ArrowLeft, ArrowUp, ArrowRight, ArrowDown } = inputState
  console.log(actor)
  if (!['standing', 'walking'].includes(actor.animation.id)) {
    actor.velocity.x = 0
    actor.velocity.y = 0
    return
  }
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  const up = KeyW || ArrowUp
  const down = KeyS || ArrowDown
  const characterData = assetCache.data.characters[actor.character].bmp
  // convert from pixel per TU (1/30s) to pixel per second
  const movementSpeed = characterData.walking_speed * 30
  // For some reason in data files, z is depth and y is up.
  // Also, we need to double the speed, as we calculate perspective,
  //     which halves the speed on screen for depth movement.
  const yMovementSpeed = characterData.walking_speedz * 30 * 2
  actor.direction = left && !right && 'left' || right && !left && 'right' || actor.direction
  actor.velocity.x = ((left && !right) ? -1 : (right && !left) ? 1 : 0) * movementSpeed
  actor.velocity.y = ((down && !up) ? -1 : (up && !down) ? 1 : 0) * yMovementSpeed
}
