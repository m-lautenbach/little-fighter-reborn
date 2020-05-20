import { assoc } from 'ramda'

import assetCache from './assetCache'
import getFrameMap from './getFrameMap'
import { worldToCamera } from './coordinates'
import state from './state'
import drawShadow from './drawShadow'

const resetTransformation = ctx => ctx.setTransform(1, 0, 0, 1, 0, 0)

export default (ctx, actor) => {
  const { character, animation: { id: animationId, frame }, position, direction } = actor
  const { x, y } = worldToCamera(state, position)
  const { x: sx, y: sy } = worldToCamera(state, assoc('z', 0, position))

  const { w, h } = assetCache.data.characters[character].bmp.frames_69
  const { [animationId]: { frames } } = getFrameMap(character)
  const { x: sourceX, y: sourceY } = frames[frame]

  const spritesheet = assetCache.images.spritesheets[character]

  const shadowCanvas = drawShadow(spritesheet, sourceX, sourceY, w, h, animationId, frame, position.z)

  if (direction === 'left') {
    ctx.setTransform(-1, 0, .5, .5, sx + (w / 2), sy - (h / 2))
    ctx.drawImage(shadowCanvas, 0, 0)
    resetTransformation(ctx)
    ctx.translate(x + w, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(spritesheet, sourceX, sourceY, w, h, 0, y - h, w, h)
    resetTransformation(ctx)
  } else {
    ctx.setTransform(1, 0, .5, .5, sx - (w / 2), sy - (h / 2))
    ctx.drawImage(shadowCanvas, 0, 0)
    resetTransformation(ctx)
    ctx.drawImage(spritesheet, sourceX, sourceY, w, h, x, y - h, w, h)
  }
}
