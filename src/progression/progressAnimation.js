import getFrameMap from '../getFrameMap'
import { always, cond, F, T } from 'ramda'

const loopingAnimations = ['standing', 'walking']

export default ({ character, velocity, animation }, newTimestamp) => {
  const { id, frame, bounced, start } = animation
  const { frames, bounce } = getFrameMap(character)[id]
  // one TU (time unit) === 1/30s; always +1
  const currentFrameEnded = ((frames[frame].wait + 1) * (1000 / 30)) < (newTimestamp - start)
  const isLastFrame = (frame === (frames.length - 1)) || (frames[frame].next === 999)

  if (loopingAnimations.includes(id) || !isLastFrame) {
    const bouncedNew = cond([
      [always(!bounced && isLastFrame), T],
      [always(bounced && frame === 0), F],
      [T, always(bounced)],
    ])()
    const nextFrame = bounce ?
      (bouncedNew ? frame - 1 : frame + 1) :
      (isLastFrame ? (frames[frame].next === 999 ? 0 : frame) : frame + 1)

    animation.frame = currentFrameEnded ? nextFrame : frame
    animation.start = currentFrameEnded ? newTimestamp : start
    animation.bounced = bouncedNew
  } else {
    velocity.x = 0
    velocity.y = 0
    animation.id = 'standing'
    animation.frame = 0
    animation.start = newTimestamp
    animation.bounced = false
  }
}
