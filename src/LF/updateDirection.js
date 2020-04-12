import { assoc } from 'ramda'

import inputState from './inputState'

export default (actor) => {
  const { KeyA, KeyD, ArrowLeft, ArrowRight } = inputState
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  return assoc('direction', left && !right && 'left' || right && !left && 'right' || actor.direction, actor)
}
