import sample from 'lodash/sample'

import inputState from '../inputState'

const xor = (a, b) => !!a !== !!b

const cancelableAnimations = ['walking', 'standing', 'running']

const getUpdatedAnimation = (animationId) => {
  if (!cancelableAnimations.includes(animationId)) {
    return animationId
  }
  const { KeyW, KeyA, KeyS, KeyD, KeyJ, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = inputState
  if (KeyJ) {
    return 'punch'
  }
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  const up = KeyW || ArrowUp
  const down = KeyS || ArrowDown
  return (xor(left, right) || xor(up, down)) ? 'walking' : 'standing'
}

export default ({ animation }) => {
  const { id: animationId } = animation
  const updatedAnimationId = getUpdatedAnimation(animationId)

  if (updatedAnimationId !== animationId) {
    animation.frame = updatedAnimationId === 'punch' ? sample([0, 2]) : 0
    animation.start = Date.now()
    animation.bounced = false
    animation.id = updatedAnimationId
  }
}
