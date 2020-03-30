import React, { useEffect } from 'react'
import { assoc, pathOr, propOr } from 'ramda'
import { Typography } from 'antd'

const { Title } = Typography

const dimensions = { width: 480, height: 320 }

const createCanvas = () => {
  const canvas = document.createElement('CANVAS')
  canvas.setAttribute('width', `${dimensions.width}px`)
  canvas.setAttribute('height', `${dimensions.height}px`)
  document.body.appendChild(canvas)
  return canvas
}

let state = {
  timestamp: Date.now(),
  debug: {
    draw: {
      boundingBox: true,
    },
  },
  background: {
    color: '#ccfbff',
  },
  rendering: {
    imageSmoothing: false,
  },
  objects: [
    {
      shape: 'rectangle',
      position: { x: 20, y: 20 },
      dimensions: { width: 100, height: 200 },
    },
  ],
}

const nextState = (state) => assoc('timestamp', Date.now(), state)

const render = (ctx, state) => () => {
  requestAnimationFrame(render(ctx, nextState(state)))
  ctx.imageSmoothingEnabled = pathOr(true, ['rendering', 'imageSmoothing'], state)
  ctx.fillStyle = pathOr('#ffffff', ['background', 'color'], state)
  ctx.fillRect(0, 0, dimensions.width, dimensions.height)
  propOr([], 'objects', state).forEach(
    ({ position: { x, y }, dimensions: { width, height } }) => {
      ctx.strokeStyle = '#ff00e0'
      ctx.strokeRect(x, y, width, height)
    },
  )
}

const start = async () => {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  render(ctx, state)()
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
