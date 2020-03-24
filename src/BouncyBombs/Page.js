import React, { useEffect } from 'react'
import { Typography } from 'antd'

import skyImage from './assets/sky.png'
import groundSprite from './assets/ground.png'
import playerSpriteSheet from './assets/player.png'
import starSprite from './assets/star.png'
import bombSprite from './assets/bomb.png'

const { Title, Paragraph } = Typography

const width = 800
const height = 600

const start = async () => {
  const Phaser = await import(/* webpackChunkName: "phaser" */ 'phaser')
  let platforms, player, cursors, stars, score = 0, scoreText, bombs, gameOver

  const collectStar = (player, star) => {
    star.disableBody(true, true)

    score += 10
    scoreText.setText(`SCORE ${score}`)

    if (stars.countActive(true) === 0) {
      stars.children.iterate(
        (child) => child.enableBody(true, child.x, 0, true, true),
      )
      const x = (player.x < 400) ?
        Phaser.Math.Between(400, 800) :
        Phaser.Math.Between(0, 400)
      const bomb = bombs.create(x, 16, 'bomb')
      bomb.setBounce(1)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    }
  }

  function hitBomb(player) {
    this.physics.pause()
    player.setTint(0xff0000)
    player.anims.play('turn')
    gameOver = true
  }

  function preload() {
    this.load.image('sky', skyImage)
    this.load.image('ground', groundSprite)
    this.load.image('star', starSprite)
    this.load.image('bomb', bombSprite)
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
    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    })
    bombs = this.physics.add.group()
    this.physics.add.collider(bombs, platforms)
    this.physics.add.collider(player, bombs, hitBomb, null, this)

    scoreText = this.add.text(
      16, 16,
      `SCORE ${score}`,
      {
        fontFamily: 'Impact ',
        fontSize: '32px',
        fill: '#000',
        resolution: 1,
      },
    )

    stars.children.iterate(
      child => child.setBounceY(Phaser.Math.FloatBetween(.4, .8)),
    )
    player.setCollideWorldBounds(true)
    this.physics.add.collider(player, platforms)
    this.physics.add.collider(stars, platforms)

    this.physics.add.overlap(player, stars, collectStar, null, this)

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
    <Title style={{ margin: '2rem' }}>BOUNCY BOMBS (WORK IN PROGRESS)</Title>
    <Paragraph>
      From this tutorial: <a target="_blank" href="https://phaser.io/tutorials/making-your-first-phaser-3-game">Making
      your first Phaser 3 game</a>
    </Paragraph>
  </>
}
