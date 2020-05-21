import inputState from '../inputState'
import assetCache from '../assetCache'

export default (actor) => {
  const { KeyW, KeyA, KeyS, KeyD, ArrowLeft, ArrowUp, ArrowRight, ArrowDown } = inputState
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  const up = KeyW || ArrowUp
  const down = KeyS || ArrowDown
  const characterData = assetCache.data.characters[actor.character].bmp
  // convert from pixel per TU (1/30s) to pixel per second
  const movementSpeed = characterData.walking_speed * 30
  actor.direction = left && !right && 'left' || right && !left && 'right' || actor.direction
  actor.velocity.x = ((left && !right) ? -1 : (right && !left) ? 1 : 0) * movementSpeed
  actor.velocity.y = ((down && !up) ? -1 : (up && !down) ? 1 : 0) * movementSpeed
}
