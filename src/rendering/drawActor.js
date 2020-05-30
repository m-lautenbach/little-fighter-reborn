import { assoc, once } from 'ramda'

import assetCache from '../assetCache'
import getFrameMap from '../getFrameMap'
import { worldToCamera } from './coordinates'
import state from '../state'
import drawShadow from './drawShadow'
import drawTag from './drawTag'

const resetTransformation = ctx => ctx.setTransform(1, 0, 0, 1, 0, 0)

const logOnce = once(console.debug)

const drawCenter = (ctx) => {
  const centerWidth = 5
  ctx.strokeStyle = '#ff00ff'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(0, -centerWidth)
  // noinspection JSSuspiciousNameCombination
  ctx.lineTo(0, centerWidth)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-centerWidth, 0)
  ctx.lineTo(centerWidth, 0)
  ctx.stroke()
}

const drawHitboxes = (ctx, hitboxes, { centerX, centerY }) => {
  hitboxes.forEach(({ x, y, w, h }) => {
    ctx.strokeStyle = '#00ffcc'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.rect(x - centerX, y - centerY, w, h)
    ctx.stroke()
  })
}

const defaultInitialAnimation = {
  id: 'standing',
  frame: 0,
  bounced: false,
  start: Date.now(),
}

export default (ctx, actor) => {
  actor.animation = actor.animation || { ...defaultInitialAnimation }

  const { character, animation: { id: animationId, frame }, position, direction } = actor
  if (animationId === 'none') return

  const { debug } = state

  const { x, y } = worldToCamera(state, position)
  // shadow coordinates
  const { x: sx, y: sy } = worldToCamera(state, assoc('z', 0, position))

  const { w, h } = assetCache.data.characters[character].header.spritesheets[0]
  const { [animationId]: { frames } } = getFrameMap(character)
  const { x: sourceX, y: sourceY, centerX, centerY, hitboxes } = frames[frame]

  const spritesheet = assetCache.images.spritesheets[character]

  logOnce(frames[frame])

  ctx.translate(sx, sy)

  if (direction === 'left') {
    ctx.scale(-1, 1)
  }
  // we mirror the sprite, but the shadow should always fall to the left
  const shearing = (direction === 'left' ? -1 : 1) * .5
  ctx.scale(1, .5)
  ctx.transform(1, 0, shearing, 1, 0, 0)

  const shadowCanvas = drawShadow(character, spritesheet, sourceX, sourceY, w, h, animationId, frame, position.z)
  ctx.drawImage(shadowCanvas, -centerX, -centerY)

  resetTransformation(ctx)

  ctx.translate(x, y)

  // we can draw the tag before mirroring as it should not overlap
  //  with the character drawn later
  drawTag(ctx, actor)

  if (direction === 'left') {
    ctx.scale(-1, 1)
  }

  ctx.drawImage(spritesheet, sourceX, sourceY, w, h, -centerX, -centerY, w, h)

  if (debug.draw.hitboxes) {
    drawHitboxes(ctx, hitboxes, { centerX, centerY })
  }
  if (debug.draw.center) {
    drawCenter(ctx)
  }

  resetTransformation(ctx)
}
