import getFrameMap from '../getFrameMap'
import { always, cond, F, T } from 'ramda'

export default ({ character, animation }, newTimestamp) => {
  const { id, frame, bounced, start } = animation
  const { frames, loop } = getFrameMap(character)[id]
  const currentFrameEnded = (frames[frame].wait * 30) < (newTimestamp - start)
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
  animation.start = currentFrameEnded ? newTimestamp : start
  animation.bounced = updatedBounced
}
