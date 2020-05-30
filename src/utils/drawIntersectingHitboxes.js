import getAllActors from '../getAllActors'
import state from '../state'
import getFrameMap from '../getFrameMap'
import { worldToCamera } from '../rendering/coordinates'

import resetTransformation from './resetTransformation'
import getIntersectingRectangle from './getIntersectingRectangle'

const drawHitboxes = (ctx, hitboxes, { centerX, centerY }, position, direction, actor2) => {
  hitboxes.forEach((hitbox) => {
    ctx.strokeStyle = '#00ffcc'
    ctx.lineWidth = 1
    ctx.beginPath()
    const transformedHitbox = {
      x: hitbox.x - centerX,
      y: hitbox.y - centerY,
      w: hitbox.w,
      h: hitbox.h,
    }
    ctx.rect(transformedHitbox.x, transformedHitbox.y, transformedHitbox.w, transformedHitbox.h)
    ctx.stroke()

    const { character, animation: { id: animationId, frame }, direction: direction2, position: position2 } = actor2
    if (animationId === 'none') return

    const { [animationId]: { frames } } = getFrameMap(character)
    const { centerX: centerX2, centerY: centerY2, hitboxes: hitboxes2 } = frames[frame]
    const { x: x1, y: y1 } = worldToCamera(state, position)
    const { x: x2, y: y2 } = worldToCamera(state, position2)

    hitboxes2.forEach(
      (hitbox2) => {
        const transformedHitbox2 = {
          x: ((direction === 'left' ?
              (x1 - x2) :
              (x2 - x1)) +
            (direction === direction2 ?
              (hitbox2.x - centerX2) :
              (centerX2 - hitbox2.x))
          ),
          y: hitbox2.y - centerY2 + y2 - y1,
          w: (direction === direction2 ? 1 : -1) * hitbox2.w,
          h: hitbox2.h,
        }

        ctx.strokeStyle = '#00ffcc'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.rect(
          transformedHitbox2.x,
          transformedHitbox2.y,
          transformedHitbox2.w,
          transformedHitbox2.h,
        )
        ctx.stroke()

        const intersection = getIntersectingRectangle(transformedHitbox, transformedHitbox2)
        if (intersection && Math.abs(position.y - position2.y) < 20) {
          ctx.fillStyle = '#ff0000'
          ctx.fillRect(
            intersection.x,
            intersection.y,
            intersection.w,
            intersection.h,
          )
        }
      },
    )

  })
}

export default (ctx) => {
  const { debug } = state
  if (!debug.draw.hitboxes) return

  const actors = getAllActors()
  actors.forEach((actor1, index) => {
    actors.slice(index + 1, actors.length).forEach(actor2 => {

      const { character, animation: { id: animationId, frame }, position, direction } = actor1
      if (animationId === 'none') return

      const { x, y } = worldToCamera(state, position)
      const { [animationId]: { frames } } = getFrameMap(character)
      const { centerX, centerY, hitboxes } = frames[frame]
      ctx.translate(x, y)
      if (direction === 'left') {
        ctx.scale(-1, 1)
      }

      drawHitboxes(ctx, hitboxes, { centerX, centerY }, position, direction, actor2)
      resetTransformation(ctx)
    })
  })
}
