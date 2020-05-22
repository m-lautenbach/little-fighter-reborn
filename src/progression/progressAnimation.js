import getFrameMap from '../getFrameMap'
import { always, cond, F, T } from 'ramda'

export default ({ character, animation }, newTimestamp) => {
  const { id, frame, bounced, start } = animation
  const { frames, bounce } = getFrameMap(character)[id]
  // one TU (time unit) === 1/30s; always +1
  const currentFrameEnded = ((frames[frame].wait + 1) * (1000 / 30)) < (newTimestamp - start)
  const isLastFrame = frame === (frames.length - 1)
  const updatedBounced = cond([
    [always(!bounced && isLastFrame), T],
    [always(bounced && frame === 0), F],
    [T, always(bounced)],
  ])()
  const nextFrame = bounce ?
    (updatedBounced ? frame - 1 : frame + 1) :
    (isLastFrame ? (frames[frame].next === 999 ? 0 : frame) : frame + 1)

  animation.frame = currentFrameEnded ? nextFrame : frame
  animation.start = currentFrameEnded ? newTimestamp : start
  animation.bounced = updatedBounced
}
