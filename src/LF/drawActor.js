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
  ctx.lineWidth = 2

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
  const { character, name, animation: { id: animationId, frame }, position, direction } = actor
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

  // we can draw the name before mirroring as it should not overlap
  //  with anything drawn afterwards (for now)
  ctx.save()
  ctx.imageSmoothingEnabled = true
  ctx.shadowColor = 'rgba(0,0,0,1)'
  ctx.fillStyle = name ? '#4a4aff' : '#ffffff'
  ctx.font = '11px sans-serif'
  ctx.lineWidth = 2
  ctx.textAlign = 'center'
  ctx.fillText(name || 'YOU', 0, 12)
  ctx.restore()

  if (direction === 'left') {
    ctx.scale(-1, 1)
  }
  // we mirror the sprite, but the shadow should always fall to the left
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
