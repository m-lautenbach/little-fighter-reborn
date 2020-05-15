import initialState from './initialState'
import LionForest from './levels/LionForest'
import assetCache from './assetCache'
import { range } from 'ramda'
import state from './state'

const parallaxes = [0, .15, .15, .273, .273, 1, 1, 1, 1]

export default (ctx) => {
  const { camera: { x: cx } } = state
  const { width, height } = initialState.rendering
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height / 2)
  ctx.fillStyle = '#104e10'
  ctx.fillRect(0, height / 2, width, height)
  LionForest.layers.forEach(
    ({ x, y, loop, width }, index) => {
      const parallax = parallaxes[index] * cx
      const image = assetCache.images.lionForestLayers[index]
      ctx.drawImage(image, x - parallax, y)
      if (loop) {
        range(1, width / loop).forEach(
          index => {
            ctx.drawImage(image, x + index * loop - parallax, y)
          },
        )
      }
    },
  )
}
