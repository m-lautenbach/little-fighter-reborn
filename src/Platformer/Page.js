import React, { useEffect } from 'react'
import { Typography } from 'antd'

import skyImage from './assets/sky.png'

const { Title, Paragraph } = Typography

const width = 800
const height = 600

const start = async () => {
  const Phaser = await import(/* webpackChunkName: "phaser" */ 'phaser')

  function preload() {
    this.load.image('sky', skyImage)
  }

  function create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0)
  }

  function update() {
  }

  new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    scene: { preload, create, update },
  })
}

export default () => {
  useEffect(() => {
    const ignored = start()
  }, [])

  return <>
    <Title style={{ margin: '2rem' }}>PLATFORMER (WORK IN PROGRESS)</Title>
    <Paragraph>
      From this tutorial: <a target="_blank" href="https://phaser.io/tutorials/making-your-first-phaser-3-game">Making
      your first Phaser 3 game</a>
    </Paragraph>
  </>
}
