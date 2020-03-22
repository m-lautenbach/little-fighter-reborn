import React, { useEffect } from 'react'
import { Typography } from 'antd'

const { Title, Paragraph } = Typography

const width = 800
const height = 600

let game

const start = async () => {
  const Phaser = await import(/* webpackChunkName: "phaser" */ 'phaser')

  function preload() {
  }

  function create() {
  }

  function update() {
  }

  game = new Phaser.Game({
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
