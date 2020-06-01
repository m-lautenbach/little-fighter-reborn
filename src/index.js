import { pathOr, test } from 'ramda'

import createCanvas from './createCanvas'
import assetCache from './assetCache'
import loadImage from './loadImage'
import LionForest from './levels/LionForest'
import initialState from './initialState'
import render from './rendering/render'
import connect from './netcode/connect'
import updateState from './progression/updateState'
import state from './state'
import handleInputs from './handleInputs'
import characters from './characters'

const mainLoop = (ctx) => {
  render(ctx)
  updateState(state)
  requestAnimationFrame(() => mainLoop(ctx))
}

const start = async () => {
  connect()

  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = pathOr(true, ['rendering', 'imageSmoothing'], initialState)

  await Promise.all(characters.map(
    async character => {
      const data = (await import(`./assets/data/${character}.json`)).default
      assetCache.data.characters[character] = data
      assetCache.images.spritesheets[character] = await loadImage(data.header.spritesheets[0].file)
    },
  ))
  assetCache.images.lionForestLayers = await Promise.all(
    LionForest.layers.map(({ img }) => loadImage(img)),
  )

  handleInputs(canvas)
  state.timestamp = Date.now()
  mainLoop(ctx)
}

const ignored = start()
