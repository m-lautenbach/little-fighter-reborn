import React, { useEffect } from 'react'
import { Typography } from 'antd'

import spriteSource1 from './assets/player.png'
import spriteSource2 from './assets/paddle_128_32.png'
import spriteSource3 from './assets/brick1_64_32.png'

const { Title } = Typography

const dimensions = { width: '480px', height: '320px' }

const createCanvas = () => {
  const canvas = document.createElement('CANVAS')
  canvas.setAttribute('width', dimensions.width)
  canvas.setAttribute('height', dimensions.height)
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

const start = async () => {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  const sprites = await Promise.all([spriteSource1, spriteSource2, spriteSource3].map(loadImage))
  sprites.forEach(
    (sprite, index) => ctx.drawImage(sprite, 0, 100 * index),
  )
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
