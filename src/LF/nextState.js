import { add, always, evolve, map, pathOr, pipe } from 'ramda'

import updateAnimation from './updateAnimation'
import updateDirection from './updateDirection'

let forward = true

export default (state) => {
  const newTimestamp = Date.now()
  const passedSeconds = (newTimestamp - state.timestamp) / 1000
  forward = (state.camera.x > state.camera.xMax) ? false : state.camera.x <= 0 && true || forward

  return evolve({
    timestamp: always(newTimestamp),
    rendering: {
      frame: add(1),
    },
    actors: map(
      pipe(
        updateAnimation,
        updateDirection,
      ),
    ),
    objects: map(
      (object) => {
        const updatePosition = (dimension) => ({
          [dimension]: add(
            passedSeconds *
            pathOr(0, ['velocity', dimension], object),
          ),
        })
        return evolve({
          velocity: {
            y: add(object.static ? 0 : passedSeconds * pathOr(0, ['world', 'gravity'], state)),
          },
          position: {
            ...updatePosition('x'),
            ...updatePosition('y'),
          },
        })(object)
      },
    ),
  })(state)
}
