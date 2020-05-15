import { always, cond, F, T } from 'ramda'

import getFrameMap from './getFrameMap'
import inputState from './inputState'

const xor = (a, b) => !!a !== !!b

const getUpdatedAnimation = () => {
  const { KeyW, KeyA, KeyS, KeyD, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = inputState
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  const up = KeyW || ArrowUp
  const down = KeyS || ArrowDown
  return (xor(left, right) || xor(up, down)) ? 'walking' : 'standing'
}

const progressAnimation = (animation) => {
  const { id, frame, bounced, start } = animation
  const { frames, loop } = getFrameMap()[id]
  const currentFrameEnded = (frames[frame].wait * 30) < (Date.now() - start)
  const isLastFrame = frame === (frames.length - 1)
  const updatedBounced = cond([
    [always(!bounced && isLastFrame), T],
    [always(bounced && frame === 0), F],
    [T, always(bounced)],
  ])()
  const nextFrame = loop === 'bounce' ?
    (updatedBounced ? frame - 1 : frame + 1) :
    (isLastFrame ? frame : frame + 1)

  animation.frame = currentFrameEnded ? nextFrame : frame
  animation.start = currentFrameEnded ? Date.now() : start
  animation.bounced = updatedBounced
}

export default animation => {
  const { id } = animation
  const updatedAnimation = getUpdatedAnimation()
  if (updatedAnimation !== id) {
    animation.frame = 0
    animation.start = Date.now()
    animation.bounced = false
    animation.id = updatedAnimation
  } else {
    progressAnimation(animation)
  }
}
