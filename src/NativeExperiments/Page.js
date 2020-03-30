import React, { useEffect } from 'react'
import { pathOr } from 'ramda'
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

const loadImage = (source) => {
  return new Promise(
    (resolve) => {
      const img = new Image()
      img.addEventListener(
        'load',
        () => resolve(img),
      )
      img.src = source
    },
  )
}

let state = {
  background: {
    color: '#000000',
  },
  rendering: {
    imageSmoothing: false,
  },
}

const render = (ctx, state) => {
  ctx.imageSmoothingEnabled = pathOr(true, ['rendering', 'imageSmoothing'], state)
  ctx.fillStyle = pathOr('#ffffff', ['background', 'color'], state)
  ctx.fillRect(0, 0, dimensions.width, dimensions.height)
}

const start = async () => {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  render(ctx, state)
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
