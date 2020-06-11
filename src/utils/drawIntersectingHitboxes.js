import getAllActors from '../getAllActors'
import state from '../state'
import getFrameMap from '../getFrameMap'
import { worldToCamera } from '../rendering/coordinates'

import getIntersectingRectangle from './getIntersectingRectangle'
import TransformationMatrix from './TransformationMatrix'

export default (ctx) => {
  const { debug } = state
  if (!debug.draw.hitboxes) return

  const actors = getAllActors()
  actors.forEach((actor1, index) => {
    actors.slice(index + 1, actors.length).forEach(actor2 => {

      const { character, animation: { id: animationId, frame }, position, direction } = actor1
      if (animationId === 'none') return

      const { [animationId]: { frames } } = getFrameMap(character)
      const { centerX, centerY, hitboxes } = frames[frame]

      drawHitboxes(ctx, hitboxes, { centerX, centerY }, position, direction, actor1, actor2)
    })
  })
}

function drawHitboxes(ctx, hitboxes, { centerX, centerY }, position, direction, actor1, actor2) {
  hitboxes.forEach((hitbox) => {
    const transformedHitbox = {
      x: hitbox.x - centerX,
      y: hitbox.y - centerY,
      w: hitbox.w,
      h: hitbox.h,
    }

    const actor1Matrix = transformationMatrixForActor(state, actor1)
    actor1Matrix.setContextTransform(ctx)
    ctx.strokeStyle = '#00ffcc'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.rect(transformedHitbox.x, transformedHitbox.y, transformedHitbox.w, transformedHitbox.h)
    ctx.stroke()
    actor1Matrix.resetContextTransform(ctx)

    const { character, animation: { id: animationId, frame }, position: position2 } = actor2
    if (animationId === 'none') return

    const { [animationId]: { frames } } = getFrameMap(character)
    const { centerX: centerX2, centerY: centerY2, hitboxes: hitboxes2 } = frames[frame]

    hitboxes2.forEach(
      (hitbox2) => {
        const transformedHitbox2 = {
          x: hitbox2.x - centerX2,
          y: hitbox2.y - centerY2,
          w: hitbox2.w,
          h: hitbox2.h,
        }

        const actor2Matrix = transformationMatrixForActor(state, actor2)
        actor2Matrix.setContextTransform(ctx)
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
        actor2Matrix.resetContextTransform(ctx)

        const intersection = getIntersectingRectangle(transformedHitbox, transformedHitbox2, actor1Matrix, actor2Matrix)
        // y is depth dimension in engine (in game files depth is z)
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

function transformationMatrixForActor(state, actor) {
  const { position, direction } = actor
  const { x, y } = worldToCamera(state, position)
  const matrix = TransformationMatrix()
  matrix.translate(x, y)
  if (direction === 'left') {
    matrix.scale(-1, 1)
  }
  return matrix
}
