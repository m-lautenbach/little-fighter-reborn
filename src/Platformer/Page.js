import React, { useEffect } from 'react'
import { Typography } from 'antd'

import skyImage from './assets/sky.png'
import groundSprite from './assets/ground.png'
import playerSpriteSheet from './assets/player.png'

const { Title, Paragraph } = Typography

const width = 800
const height = 600

const start = async () => {
  const Phaser = await import(/* webpackChunkName: "phaser" */ 'phaser')
  let platforms, player, cursors

  function preload() {
    this.load.image('sky', skyImage)
    this.load.image('ground', groundSprite)
    this.load.spritesheet(
      'player',
      playerSpriteSheet,
      { frameWidth: 8, frameHeight: 12 },
    )
  }

  function create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0)

    platforms = this.physics.add.staticGroup()
    platforms.create(200, 584, 'ground').setScale(4).refreshBody()
    platforms.create(600, 584, 'ground').setScale(4).refreshBody()
    platforms.create(600, 430, 'ground').setScale(4).refreshBody()
    platforms.create(50, 260, 'ground').setScale(4).refreshBody()
    platforms.create(750, 220, 'ground').setScale(4).refreshBody()

    player = this.physics
      .add.sprite(100, 450, 'player')
      .setScale(4)
    player.setBounce(.2)
    player.setCollideWorldBounds(true)

    this.physics.add.collider(player, platforms)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(
        'player',
        { start: 0, end: 3 },
      ),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers(
        'player',
        { start: 4, end: 5 },
      ),
      frameRate: 1,
      repeat: -1,
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(
        'player',
        { start: 6, end: 9 },
      ),
      frameRate: 10,
      repeat: -1,
    })

    cursors = this.input.keyboard.createCursorKeys()
  }

  function update() {
    if (cursors.left.isDown) {
      player.setVelocityX(-160)
      player.anims.play('left', true)
    } else if (cursors.right.isDown) {
      player.setVelocityX(160)
      player.anims.play('right', true)
    } else {
      player.setVelocityX(0)
      player.anims.play('turn', true)
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330)
    }
  }

  new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false,
      },
    },
    pixelArt: true,
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
