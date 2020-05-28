import sample from 'lodash/sample'

import inputState from '../inputState'
import getFrameMap from '../getFrameMap'

const xor = (a, b) => !!a !== !!b

const cancelableAnimations = ['walking', 'standing', 'running', 'none']

const getUpdatedAnimation = (animationId, character) => {
  if (!cancelableAnimations.includes(animationId)) {
    return animationId
  }
  const { KeyW, KeyA, KeyS, KeyD, KeyJ, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = inputState
  if (KeyJ) {
    delete inputState.KeyJ
    const frameMap = getFrameMap(character)
    return 'punch' in frameMap ? 'punch' : sample(['punchA', 'punchB'])
  }
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  const up = KeyW || ArrowUp
  const down = KeyS || ArrowDown
  return (xor(left, right) || xor(up, down)) ? 'walking' : 'standing'
}

export default (actor) => {
  const { animation, character } = actor

  const { id: animationId } = animation
  const updatedAnimationId = getUpdatedAnimation(animationId, character)

  if (updatedAnimationId !== animationId) {
    animation.frame = 0
    animation.start = Date.now()
    animation.bounced = false
    animation.id = updatedAnimationId
  }
}
