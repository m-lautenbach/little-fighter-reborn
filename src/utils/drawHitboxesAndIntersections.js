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
    drawHitboxes(ctx, actor1)
    drawHitInteraction(ctx, actor1)

    actors.slice(index + 1, actors.length).forEach(actor2 => {
      // TODO: draw intersections
    })
  })
}

function drawHitboxes(ctx, actor) {
  const currentFrame = getCurrentAnimationFrame(actor)
  if (currentFrame === null) return
  const { centerX, centerY, hitboxes } = currentFrame

  hitboxes.forEach((hitbox) => {
    const transformedBox = {
      x: hitbox.x - centerX,
      y: hitbox.y - centerY,
      w: hitbox.w,
      h: hitbox.h,
    }

    const actor1Matrix = transformationMatrixForActor(state, actor)
    actor1Matrix.setContextTransform(ctx)
    ctx.strokeStyle = '#00ffcc'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.rect(transformedBox.x, transformedBox.y, transformedBox.w, transformedBox.h)
    ctx.stroke()
    actor1Matrix.resetContextTransform(ctx)
  })
}

function drawHitInteraction(ctx, actor) {
  const currentFrame = getCurrentAnimationFrame(actor)
  if (currentFrame === null) return
  const { centerX, centerY, interactions } = currentFrame
  if (!interactions) return
  const hitInteractions = interactions.filter(({ interaction: { kind } }) => kind === 'hit')
  if (hitInteractions.length === 0) return

  hitInteractions.forEach(({ interaction: { x, y, w, h } }) => {
    const transformedBox = {
      x: x - centerX,
      y: y - centerY,
      w: w,
      h: h,
    }

    const actor1Matrix = transformationMatrixForActor(state, actor)
    actor1Matrix.setContextTransform(ctx)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.rect(transformedBox.x, transformedBox.y, transformedBox.w, transformedBox.h)
    ctx.stroke()
    actor1Matrix.resetContextTransform(ctx)
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

function getCurrentAnimationFrame(actor) {
  const { character, animation: { id: animationId, frame } } = actor
  if (animationId === 'none') return null

  const { [animationId]: { frames } } = getFrameMap(character)
  return frames[frame]
}
