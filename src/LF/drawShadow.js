import { path } from 'ramda'

const shadowCache = {}

export default (spritesheet, sourceX, sourceY, w, h, animationId, frame, z) => {
  const canvas = document.getElementById('image-manipulation')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(spritesheet, sourceX, sourceY, w, h, 0, 0, w, h)

  let shadow
  const alpha = Math.round((1 - Math.min(1, z / 50)) * 80)
  const shadowFromCache = path([animationId, frame, alpha], shadowCache)
  if (shadowFromCache) {
    shadow = shadowFromCache
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
    if (!shadowCache[animationId]) {
      shadowCache[animationId] = {}
    }
    if (!shadowCache[animationId][frame]) {
      shadowCache[animationId][frame] = {}
    }
    shadowCache[animationId][frame][alpha] = shadow
  }
  ctx.putImageData(shadow, 0, 0)
  return canvas
}
