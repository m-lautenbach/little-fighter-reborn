import { pathOr } from 'ramda'

import createCanvas from './createCanvas'
import assetCache from './assetCache'
import loadImage from './loadImage'
import LionForest from './levels/LionForest'
import initialState from './initialState'
import inputState from './inputState'
import nextState from './nextState'
import render from './render'
import connect from './netcode/connect'
import channels from './netcode/channels'

const mainLoop = (ctx, state) => () => {
  requestAnimationFrame(mainLoop(ctx, nextState(state)))
  render(ctx, state)
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

  mainLoop(ctx, initialState)()
  document.onkeydown = ({ code, repeat }) => {
    if (repeat) return
    inputState[code] = Date.now()
    channels.forEach(channel => channel.send(JSON.stringify({ code, down: true })))
  }
  document.onkeyup = ({ code, repeat }) => {
    if (repeat) return
    delete inputState[code]
    channels.forEach(channel => channel.send(JSON.stringify({ code, up: true })))
  }
}
