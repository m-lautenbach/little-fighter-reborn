import getFrameMap from '../getFrameMap'
import { always, cond, F, T } from 'ramda'
import updateAnimation from './updateAnimation'
import updateDirection from './updateDirection'

const loopingAnimations = ['standing', 'walking']

export default (actor, newTimestamp) => {
  const { character, animation } = actor
  const { id: animationId, frame, bounced, start } = animation
  const { frames, bounce } = getFrameMap(character)[animationId]
  // one TU (time unit) === 1/30s; always +1
  const currentFrameEnded = newTimestamp > start + (frames[frame].wait + 1) * (1000 / 30)
  if (!currentFrameEnded) {
    return
  }

  const isLastFrame = (frame === (frames.length - 1)) || (frames[frame].next === 999)

  if (loopingAnimations.includes(animationId) || !isLastFrame) {
    const bouncedNew = cond([
      [always(!bounced && isLastFrame), T],
      [always(bounced && frame === 0), F],
      [T, always(bounced)],
    ])()

    animation.frame = bounce ?
      (bouncedNew ? frame - 1 : frame + 1) :
      (isLastFrame ? (frames[frame].next === 999 ? 0 : frame) : frame + 1)

    animation.start = newTimestamp
    animation.bounced = bouncedNew
  } else {
    animation.id = 'none'
    updateAnimation(actor)
    updateDirection(actor)
  }
}
