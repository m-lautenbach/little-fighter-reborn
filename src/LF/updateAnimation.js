import { always, assoc, cond, evolve, F, pipe, T } from 'ramda'

import getFrameMap from './getFrameMap'
import inputState from './inputState'

const getUpdatedAnimation = () => {
  const { KeyW, KeyA, KeyS, KeyD, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = inputState
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  const up = KeyW || ArrowUp
  const down = KeyS || ArrowDown
  return (left && right || up && down || !(left || right || up || down)) ? 'standing' : 'walking'
}

const progressAnimation = (actor) => {
  const { animation: { id, frame, bounced, start } } = actor
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
  return evolve({
    animation: pipe(
      assoc('frame', currentFrameEnded ? nextFrame : frame),
      assoc('start', currentFrameEnded ? Date.now() : start),
      assoc('bounced', updatedBounced),
    ),
  })(actor)
}

export default actor => {
  const { animation: { id } } = actor
  const updatedAnimation = getUpdatedAnimation()
  if (updatedAnimation !== id) {
    return evolve({
      animation: {
        frame: always(0),
        start: always(Date.now()),
        bounced: always(false),
        id: always(updatedAnimation),
      },
    })(actor)
  } else {
    return progressAnimation(actor)
  }
}
