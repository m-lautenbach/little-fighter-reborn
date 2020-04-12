import { pathOr } from 'ramda'

import createCanvas from './createCanvas'
import assetCache from './assetCache'
import loadImage from './loadImage'
import LionForest from './levels/LionForest'
import initialState from './initialState'
import inputState from './inputState'
import nextState from './nextState'
import render from './render'

const mainLoop = (ctx, state) => () => {
  requestAnimationFrame(mainLoop(ctx, nextState(state)))
  render(ctx, state)
}

export default async () => {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = pathOr(true, ['rendering', 'imageSmoothing'], initialState)
  assetCache.data.characters.freeze = (await import('./assets/littlefighter2/freeze.lfdata')).default
  assetCache.images.freezeSpritesheet = await loadImage(assetCache.data.characters.freeze.bmp.frames_69.file)
  assetCache.images.lionForestLayers = await Promise.all(
    LionForest.layers.map(({ img }) => loadImage(img)),
  )

  mainLoop(ctx, initialState)()
  document.onkeydown = ({ code }) => inputState[code] = Date.now()
  document.onkeyup = ({ code }) => delete inputState[code]
}
