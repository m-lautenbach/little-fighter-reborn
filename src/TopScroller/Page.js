import React, { useEffect } from 'react'
import { Typography } from 'antd'

import BootGameScene from './BootGameScene'
import PlayGameScene from './PlayGameScene'

const { Title, Paragraph } = Typography

const start = async () => {
  const Phaser = await import(/* webpackChunkName: "phaser" */ 'phaser')

  const gameDimensions = {
    width: 256,
    height: 272,
  }

  new Phaser.Game({
    ...gameDimensions,
    backgroundColor: '#000',
    scene: [BootGameScene, PlayGameScene(gameDimensions)],
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
  })
}

export default () => {
  useEffect(() => {
    const ignored = start()
  }, [])

  return <>
    <Title style={{ margin: '2rem' }}>
      TopScroller 3000
    </Title>
    <Paragraph>
      From this tutorial: <a
      target="_blank" href="https://www.youtube.com/watch?v=gFXx7lgxK9A&list=PLDyH9Tk5ZdFzEu_izyqgPFtHJJXkc79no&index=2"
    >Getting Started with Phaser 3</a>
    </Paragraph>
  </>
}

