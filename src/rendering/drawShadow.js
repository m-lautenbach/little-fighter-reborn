import { path } from 'ramda'
import set from 'lodash/set'

const shadowCache = {}

export default (character, spritesheet, sourceX, sourceY, w, h, animationId, frame, height) => {
  const canvas = document.getElementById('image-manipulation')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(spritesheet, sourceX, sourceY, w, h, 0, 0, w, h)

  let shadow
  // the shadow fades with the characters distance from the ground
  const alpha = Math.round((1 - Math.min(1, height / 50)) * 80)
  const shadowFromCache = path([character, animationId, frame, alpha], shadowCache)
  if (shadowFromCache) {
    shadow = shadowFromCache
  } else {
    shadow = ctx.getImageData(0, 0, w, h)
    shadow.data.forEach((value, index) => {
      // is transparency
      if ((index + 1) % 4 === 0) {
        // make transparent, but not less transparent (don't overwrite fully transparent background)
        shadow.data[index] = Math.min(value, alpha)
        // is color
      } else {
        // make black
        shadow.data[index] = 0
      }
    })
    set(shadowCache, [character, animationId, frame, alpha], shadow)
  }
  ctx.putImageData(shadow, 0, 0)
  return canvas
}
