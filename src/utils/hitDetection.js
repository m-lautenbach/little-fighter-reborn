import sample from 'lodash/sample'

import getAllActors from '../getAllActors'
import state from '../state'
import getFrameMap from '../getFrameMap'
import { worldToCamera } from '../rendering/coordinates'

import getIntersectingRectangle from './getIntersectingRectangle'
import TransformationMatrix from './TransformationMatrix'

export default (ctx) => {
  const actors = getAllActors()
  actors.forEach((actor1) => {
    if (state.debug.draw.interaction) drawHitboxes(ctx, actor1)

    const hitInteractions1 = getAndDrawHitInteractions(ctx, actor1)
    const matrix1 = getTransformationMatrixForActor(state, actor1)

    actors.forEach(actor2 => {
      if (actor1 === actor2) return
      const currentFrame = getCurrentAnimationFrame(actor2)
      if (currentFrame === null) return
      const { hitboxes } = currentFrame
      const matrix2 = getTransformationMatrixForActor(state, actor2)
      hitInteractions1.forEach(({ interaction: _hitInteraction }) => {
        const hitInteraction = offsetBox(_hitInteraction, actor1)
        hitboxes.forEach(_hitbox => {
          const hitbox = offsetBox(_hitbox, actor2)
          // overlap is in screen coordinates, but as actors need to have similar depth to it it's a small error
          const intersection = getIntersectingRectangle(hitInteraction, hitbox, matrix1, matrix2)

          // y is depth dimension in engine (in game files depth is z)
          if (intersection && Math.abs(actor1.position.y - actor2.position.y) < 20) {
            console.debug(`${actor2.name} (${actor2.character}) says: "${sample([
              'ooof',
              'ouch',
              'ahhh',
              'STOP IT!!!',
            ])}"`)

            if (!state.debug.draw.interaction) return
            ctx.fillStyle = '#ff0000'
            ctx.fillRect(intersection.x, intersection.y, intersection.w, intersection.h)
          }
        })
      })
    })
  })
}

function drawHitboxes(ctx, actor) {
  const currentFrame = getCurrentAnimationFrame(actor)
  if (currentFrame === null) return
  const { hitboxes } = currentFrame

  hitboxes.forEach((_hitbox) => {
    const hitbox = offsetBox(_hitbox, actor)

    const actor1Matrix = getTransformationMatrixForActor(state, actor)
    actor1Matrix.setContextTransform(ctx)
    ctx.strokeStyle = '#00ffcc'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.rect(hitbox.x, hitbox.y, hitbox.w, hitbox.h)
    ctx.stroke()
    actor1Matrix.resetContextTransform(ctx)
  })
}

function getAndDrawHitInteractions(ctx, actor) {
  const currentFrame = getCurrentAnimationFrame(actor)
  if (currentFrame === null) return []
  const { interactions } = currentFrame
  if (!interactions) return []
  const hitInteractions = interactions.filter(({ interaction: { kind } }) => kind === 'hit')
  if (hitInteractions.length === 0) return []

  if (state.debug.draw.interaction) {
    hitInteractions.forEach(({ interaction }) => {
      const interactionBox = offsetBox(interaction, actor)

      const actor1Matrix = getTransformationMatrixForActor(state, actor)
      actor1Matrix.setContextTransform(ctx)
      ctx.strokeStyle = '#ff6200'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.rect(interactionBox.x, interactionBox.y, interactionBox.w, interactionBox.h)
      ctx.stroke()
      actor1Matrix.resetContextTransform(ctx)
    })
  }
  return hitInteractions
}

function getTransformationMatrixForActor(state, actor) {
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

// boxes in data files are to be interpreted from top left corner
function offsetBox(box, actor) {
  const currentFrame = getCurrentAnimationFrame(actor)
  if (currentFrame === null) return box
  const { centerX, centerY } = currentFrame
  return {
    x: box.x - centerX,
    y: box.y - centerY,
    w: box.w,
    h: box.h,
  }
}
