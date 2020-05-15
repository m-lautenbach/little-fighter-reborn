import getFrameMap from './getFrameMap'
import { always, cond, F, T } from 'ramda'

export default (animation) => {
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
