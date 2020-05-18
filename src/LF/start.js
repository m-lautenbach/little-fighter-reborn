import { pathOr } from 'ramda'

import createCanvas from './createCanvas'
import assetCache from './assetCache'
import loadImage from './loadImage'
import LionForest from './levels/LionForest'
import initialState from './initialState'
import render from './render'
import connect from './netcode/connect'
import updateState from './updateState'
import state from './state'
import handleInputs from './handleInputs'
import characters from './characters'

const mainLoop = (ctx) => {
  render(ctx)
  updateState(state)
  requestAnimationFrame(() => mainLoop(ctx))
}

export default async () => {
  connect()

  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = pathOr(true, ['rendering', 'imageSmoothing'], initialState)

  await Promise.all(characters.map(
    async character => {
      assetCache.data.characters[character] = (await import(`./assets/littlefighter2/${character}.lfdata`)).default
      // noinspection JSUnresolvedVariable
      assetCache.images.spritesheets[character] = await loadImage(assetCache.data.characters[character].bmp.frames_69.file)
    },
  ))
  assetCache.images.lionForestLayers = await Promise.all(
    LionForest.layers.map(({ img }) => loadImage(img)),
  )

  handleInputs()
  state.timestamp = Date.now()
  mainLoop(ctx)
}
