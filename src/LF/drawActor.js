import { assoc, once } from 'ramda'

import assetCache from './assetCache'
import getFrameMap from './getFrameMap'
import { worldToCamera } from './coordinates'
import state from './state'
import drawShadow from './drawShadow'

const resetTransformation = ctx => ctx.setTransform(1, 0, 0, 1, 0, 0)

const logOnce = once(console.debug)

const drawCenter = (ctx) => {
  const centerWidth = 5
  ctx.strokeStyle = '#ff00ff'

  ctx.beginPath()
  ctx.moveTo(0, -centerWidth)
  ctx.lineTo(0, centerWidth)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-centerWidth, 0)
  ctx.lineTo(centerWidth, 0)
  ctx.stroke()
}

export default (ctx, actor) => {
  const { character, animation: { id: animationId, frame }, position, direction } = actor
  const { debug } = state

  const { x, y } = worldToCamera(state, position)
  // shadow coordinates
  const { x: sx, y: sy } = worldToCamera(state, assoc('z', 0, position))

  const { w, h } = assetCache.data.characters[character].bmp.frames[0]
  const { [animationId]: { frames } } = getFrameMap(character)
  const { x: sourceX, y: sourceY, centerx, centery } = frames[frame]

  const spritesheet = assetCache.images.spritesheets[character]

  logOnce(frames[frame])

  ctx.translate(sx, sy)
  if (direction === 'left') {
    ctx.scale(-1, 1)
  }
  // we mirror for the sprite, but the shadow should always fall to left
  const shearing = (direction === 'left' ? -1 : 1) * .5
  ctx.scale(1, .5)
  ctx.transform(1, 0, shearing, 1, 0, 0)

  const shadowCanvas = drawShadow(spritesheet, sourceX, sourceY, w, h, animationId, frame, position.z)
  ctx.drawImage(shadowCanvas, -centerx, -centery)

  resetTransformation(ctx)
  ctx.translate(x, y)
  if (direction === 'left') {
    ctx.scale(-1, 1)
  }

  ctx.drawImage(spritesheet, sourceX, sourceY, w, h, -centerx, -centery, w, h)

  if (debug.draw.center) {
    drawCenter(ctx)
  }

  resetTransformation(ctx)
}
