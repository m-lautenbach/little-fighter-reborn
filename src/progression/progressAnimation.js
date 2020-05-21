import getFrameMap from '../getFrameMap'

export default ({ character, animation }, newTimestamp) => {
  const { id, frame, start } = animation
  const { frames } = getFrameMap(character)[id]
  // one TU (time unit) === 1/30s
  const currentFrameEnded = (frames[frame].wait * (1000 / 30)) < (newTimestamp - start)
  const isLastFrame = frame === (frames.length - 1)
  const nextFrame = isLastFrame ? (frames[frame].next === 999 ? 0 : frame) : frame + 1

  animation.frame = currentFrameEnded ? nextFrame : frame
  animation.start = currentFrameEnded ? newTimestamp : start
}
