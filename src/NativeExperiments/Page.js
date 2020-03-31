import React, { useEffect } from 'react'
import { add, always, evolve, map, pathOr, propOr } from 'ramda'
import { Typography } from 'antd'

import freezeData from './assets/littlefighters2/sprite/sys/freeze.lfdata'

const { Title } = Typography

const dimensions = { width: 800, height: 600 }

const createCanvas = () => {
  const canvas = document.createElement('CANVAS')
  canvas.setAttribute('width', `${dimensions.width}px`)
  canvas.setAttribute('height', `${dimensions.height}px`)
  document.body.appendChild(canvas)
  return canvas
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
  objects: [
    {
      position: { x: 20, y: 20 },
      dimensions: { width: 20, height: 50 },
      velocity: { x: 400, y: 0 },
    },
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

const render = (ctx, state) => () => {
  requestAnimationFrame(render(ctx, nextState(state)))
  ctx.imageSmoothingEnabled = pathOr(true, ['rendering', 'imageSmoothing'], state)
  ctx.fillStyle = pathOr('#ffffff', ['background', 'color'], state)
  ctx.fillRect(0, 0, dimensions.width, dimensions.height)
  propOr([], 'objects', state).forEach(
    ({ type, position: { x, y }, dimensions: { width, height } }) => {
      ctx.strokeStyle = type === 'static' ? '#ff00e0' : '#00ffc3'
      ctx.strokeRect(x, y, width, height)
    },
  )
}

const start = async () => {
  console.log(require(`./assets/littlefighters2/${freezeData.bmp.head}`))
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
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
