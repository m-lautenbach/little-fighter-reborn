import inputState from '../inputState'

const movementSpeed = 130

export default (actor) => {
  const { KeyW, KeyA, KeyS, KeyD, ArrowLeft, ArrowUp, ArrowRight, ArrowDown } = inputState
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  const up = KeyW || ArrowUp
  const down = KeyS || ArrowDown
  actor.direction = left && !right && 'left' || right && !left && 'right' || actor.direction
  actor.velocity.x = ((left && !right) ? -1 : (right && !left) ? 1 : 0) * movementSpeed
  actor.velocity.y = ((down && !up) ? -1 : (up && !down) ? 1 : 0) * movementSpeed
}
