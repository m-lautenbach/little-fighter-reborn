import paddleSprite from './assets/images/paddle_128_32.png'
import ballSprite from './assets/images/ball_32_32.png'
import brick1Sprite from './assets/images/brick1_64_32.png'
import brick2Sprite from './assets/images/brick2_64_32.png'
import brick3Sprite from './assets/images/brick3_64_32.png'

const width = 720
const height = 480

let game

export const start = async () => {
  const Phaser = await import(/* webpackChunkName: "phaser" */ 'phaser')
  let player, ball, bricks1, bricks2, bricks3, cursors

  function preload() {
    this.load.image('ball', ballSprite)
    this.load.image('paddle', paddleSprite)
    this.load.image('brick1', brick1Sprite)
    this.load.image('brick2', brick2Sprite)
    this.load.image('brick3', brick3Sprite)
  }

  function create() {
    player = this.physics.add.sprite(
      width / 2,
      height - 20,
      'paddle',
    )
    ball = this.physics.add.sprite(
      width / 2,
      height - 20 - 16 - 16,
      'ball',
    )
    bricks1 = this.physics.add.group({
      key: 'brick1',
      repeat: 9,
      setXY: { x: 45, y: 70, stepX: 70 },
    })
    bricks3 = this.physics.add.group({
      key: 'brick3',
      repeat: 9,
      setXY: { x: 45, y: 140, stepX: 70 },
    })
    bricks2 = this.physics.add.group({
      key: 'brick2',
      repeat: 9,
      setXY: { x: 45, y: 210, stepX: 70 },
    })
  }

  function update() {
  }

  for (let existingCanvas of document.getElementsByTagName('canvas')) {
    existingCanvas.remove()
  }

  game = new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    backgroundColor: '#d8d8d8',
    scene: { preload, create, update },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: false,
      },
    },
  })
}

export const stop = () => {
  if (game) {
    game.stopped = true
  }
}
