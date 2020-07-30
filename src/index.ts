import { pathOr } from 'ramda'

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
import * as characters from './characters'

const mainLoop = (ctx: any) => {
  render(ctx)
  updateState()
  requestAnimationFrame(() => mainLoop(ctx))
}

const start = async () => {
  connect()

  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = pathOr(true, ['rendering', 'imageSmoothing'], initialState)

  await Promise.all(characters.all.map(
    async character => {
      const data = (await import(`./assets/data/${character}.json`)).default
      assetCache.data.characters[character] = data
      assetCache.images.spritesheets[character] = await loadImage(data.header.spritesheets[0].file)
      assetCache.sounds.hits = await Promise.all(['001', '002'].map(
        async index => new Audio((await require(`./assets/audio/${index}.mp3`)).default)
      ))
    },
  ))
  assetCache.images.lionForestLayers = await Promise.all(
    LionForest.layers.map(({ img }) => loadImage(img)),
  )

  handleInputs()
  state.timestamp = Date.now()
  mainLoop(ctx)
}

const ignored = start()
