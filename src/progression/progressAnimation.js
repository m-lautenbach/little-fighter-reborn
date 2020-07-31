import getFrameMap from '../getFrameMap'
import { always, cond, F, findIndex, last, propEq, T } from 'ramda'
import updatePlayer from '../updatePlayer'

export default (actor, newTimestamp) => {
  const { character, animation } = actor
  if (!animation) return
  const { id: animationId, frame: frameIndex, bounced, start } = animation
  if (animationId === 'none') return
  const { frames, repeat } = getFrameMap(character)[animationId]
  const frame = frames[frameIndex]
  if (frame.sound) {
    const index = last(frame.sound.split('/')).split('.')[0]
    const sound = assetCache.sounds[index]
    sound.play()
  }
  // one TU (time unit) === 1/30s; always +1
  const currentFrameEnded = newTimestamp > start + (frame.wait + 1) * (1000 / 30)
  if (!currentFrameEnded) {
    return
  }

  const isLastFrame = (frameIndex === (frames.length - 1)) || (frame.next === 999)

  if (repeat !== 'none' || !isLastFrame) {
    const bouncedNew = cond([
      [always(!bounced && isLastFrame), T],
      [always(bounced && frameIndex === 0), F],
      [T, always(bounced)],
    ])()

    animation.frame = repeat === 'pingpong' ?
      (bouncedNew ? frameIndex - 1 : frameIndex + 1) :
      (isLastFrame ? (frame.next === 999 ? 0 : frameIndex) :
          findIndex(propEq('index', frame.next), frames)
      )

    animation.start = newTimestamp
    animation.bounced = bouncedNew
  } else {
    animation.id = 'none'
    updatePlayer()
  }
}
