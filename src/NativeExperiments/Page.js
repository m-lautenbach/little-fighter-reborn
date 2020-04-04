import React, { useEffect } from 'react'
import {
  add,
  always,
  evolve,
  map,
  pathOr,
  propOr,
  prop,
  indexBy,
} from 'ramda'
import { Typography } from 'antd'

import freezeData from './assets/littlefighters2/freeze.lfdata'
import loadImage from './loadImage'

const { Title } = Typography

const dimensions = { width: 800, height: 600 }

const createCanvas = () => {
  const canvas = document.createElement('CANVAS')
  canvas.setAttribute('width', `${dimensions.width}px`)
  canvas.setAttribute('height', `${dimensions.height}px`)
  document.body.appendChild(canvas)
  return canvas
}

const staticState = {
  characters: {
    freeze: freezeData,
  },
}

let initialState = {
  timestamp: Date.now(),
  debug: {
    draw: {
      boundingBox: true,
    },
  },
  world: {
    gravity: 980,
  },
  background: {
    color: '#ccfbff',
  },
  rendering: {
    frame: 0,
    imageSmoothing: true,
  },
  actors: [
    {
      character: 'freeze',
      position: { x: 20, y: 20 },
      animation: 'standing',
    },
  ],
  objects: [
    // {
    //   position: { x: 20, y: 20 },
    //   dimensions: { width: 20, height: 50 },
    //   velocity: { x: 400, y: 0 },
    // },
    {
      static: true,
      position: { x: 0, y: dimensions.height - 30 },
      dimensions: { width: dimensions.width, height: 30 },
    },
  ],
}

const nextState = (state) => {
  const newTimestamp = Date.now()
  const passedSeconds = (newTimestamp - state.timestamp) / 1000

  return evolve({
    timestamp: always(newTimestamp),
    rendering: {
      frame: add(1),
    },
    objects: map(
      (object) => {
        const updatePosition = (dimension) => ({
          [dimension]: add(
            passedSeconds *
            pathOr(0, ['velocity', dimension], object),
          ),
        })
        return evolve({
          velocity: {
            y: add(object.static ? 0 : passedSeconds * pathOr(0, ['world', 'gravity'], state)),
          },
          position: {
            ...updatePosition('x'),
            ...updatePosition('y'),
          },
        })(object)
      },
    ),
  })(state)
}

const images = {}

const { bmp: sheetData, frames } = staticState.characters['freeze']
console.log({ sheetData, frames })
const { w, h, row, end } = sheetData.frames_69
const frameMap =
  indexBy(
    prop('index'),
    map(
      value =>
        ({
          ...value,
          x: (value.index % row) * (w + 1),
          y: Math.floor(value.index / row) * (h + 1),
        }),
      frames,
    ),
  )

const clearCanvas = (ctx) => ctx.fillRect(0, 0, dimensions.width, dimensions.height)

const drawActor = (ctx, actor, frameIndex = 0) => () => {
  // const { character, animation } = actor

  const frame = frameMap[frameIndex]
  const drawNext = drawActor(ctx, actor, (frameIndex + 1) % end)
  if (frame) {
    clearCanvas(ctx)
    const { x: sourceX, y: sourceY, wait } = frame
    ctx.drawImage(images.freezeSpritesheet, sourceX, sourceY, w, h, 20, 20, w, h)
    setTimeout(drawNext, wait * 50)
  } else {
    drawNext()
  }
}

const render = (ctx, state) => () => {
  // requestAnimationFrame(render(ctx, nextState(state)))
  ctx.imageSmoothingEnabled = pathOr(true, ['rendering', 'imageSmoothing'], state)
  ctx.fillStyle = pathOr('#ffffff', ['background', 'color'], state)
  clearCanvas(ctx)
  propOr([], 'objects', state).forEach(
    ({ type, position: { x, y }, dimensions: { width, height } }) => {
      ctx.strokeStyle = type === 'static' ? '#ff00e0' : '#00ffc3'
      ctx.strokeRect(x, y, width, height)
    },
  )
  propOr([], 'actors', state).forEach(actor => drawActor(ctx, actor)())
}

const start = async () => {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  const freezeSpritesheet = (await import('./assets/littlefighters2/' + freezeData.bmp.frames_69.file)).default
  images.freezeSpritesheet = await loadImage(freezeSpritesheet)

  render(ctx, initialState)()
}

export default () => {
  useEffect(() => {
    const ignored = start()
  }, [])

  return <>
    <Title style={{ margin: '2rem' }}>
      Native experiments
    </Title>
  </>
}
