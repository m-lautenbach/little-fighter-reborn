import { assoc } from 'ramda'

import assetCache from './assetCache'
import getFrameMap from './getFrameMap'
import { worldToCamera } from './coordinates'

const shadowCache = {}

const drawShadow = (spritesheet, sourceX, sourceY, w, h, frame, z) => {
  const canvas = document.getElementById('image-manipulation')
  const ctx = canvas.getContext('2d')
  ctx.drawImage(spritesheet, sourceX, sourceY, w, h, 0, 0, w, h)

  let shadow
  const alpha = Math.round((1 - Math.min(1, z / 100)) * 80)
  if (shadowCache[frame] && shadowCache[frame][alpha]) {
    shadow = shadowCache[frame][alpha]
  } else {
    shadow = ctx.getImageData(0, 0, w, h)
    shadow.data.forEach((value, index) => {
      // is transparency
      if ((index + 1) % 4 === 0) {
        // if not fully transparent
        if (value !== 0) {
          shadow.data[index] = alpha
        }
      } else {
        // make black
        shadow.data[index] = 0
      }
    })
    if (!shadowCache[frame]) {
      shadowCache[frame] = {}
    }
    shadowCache[frame][alpha] = shadow
  }
  ctx.putImageData(shadow, 0, 0)
  return canvas
}

const resetTransformation = ctx => ctx.setTransform(1, 0, 0, 1, 0, 0)

export default (ctx, actor, state) => () => {
  const { character, animation: { id: animationId, frame }, position, direction } = actor
  const { x, y } = worldToCamera(state, position)
  const { x: sx, y: sy } = worldToCamera(state, assoc('z', 0, position))

  const { w, h } = assetCache.data.characters[character].bmp.frames_69
  const { [animationId]: { frames } } = getFrameMap()
  const { x: sourceX, y: sourceY } = frames[frame]

  const spritesheet = assetCache.images.freezeSpritesheet

  const shadowCanvas = drawShadow(spritesheet, sourceX, sourceY, w, h, frame, position.z)

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
