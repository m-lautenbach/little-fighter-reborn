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
import channels from './netcode/channels'

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
  assetCache.data.characters.freeze = (await import('./assets/littlefighter2/freeze.lfdata')).default
  // noinspection JSUnresolvedVariable
  assetCache.images.freezeSpritesheet = await loadImage(assetCache.data.characters.freeze.bmp.frames_69.file)
  assetCache.images.lionForestLayers = await Promise.all(
    LionForest.layers.map(({ img }) => loadImage(img)),
  )

  handleInputs()
  state.timestamp = Date.now()
  channels.forEach(channel => channel.send(JSON.stringify({ type: 'update', actor: state.player })))
  mainLoop(ctx)
}
