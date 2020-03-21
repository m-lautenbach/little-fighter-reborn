import paddleSprite from './assets/images/paddle_128_32.png'
import ballSprite from './assets/images/ball_32_32.png'
import brick1Sprite from './assets/images/brick1_64_32.png'
import brick2Sprite from './assets/images/brick2_64_32.png'
import brick3Sprite from './assets/images/brick3_64_32.png'

let game
let ball

export const start = async () => {
  const Phaser = await import(/* webpackChunkName: "phaser" */ 'phaser')

  function preload() {
    this.load.image('ball', ballSprite)
    this.load.image('paddle', paddleSprite)
    this.load.image('brick1', brick1Sprite)
    this.load.image('brick2', brick2Sprite)
    this.load.image('brick3', brick3Sprite)
  }

  function create() {
    ball = this.add.sprite(50, 50, 'ball')
  }

  function update() {
    ball.x += 1
    ball.y += 1
  }

  for (let existingCanvas of document.getElementsByTagName('canvas')) {
    existingCanvas.remove()
  }

  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#eee',
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
