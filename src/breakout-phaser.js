import paddleSprite from './assets/images/paddle_128_32.png'
import ballSprite from './assets/images/ball_32_32.png'
import brick1Sprite from './assets/images/brick1_64_32.png'
import brick2Sprite from './assets/images/brick2_64_32.png'
import brick3Sprite from './assets/images/brick3_64_32.png'

const width = 720
const height = 480

let game
let acceleration = 1

const hitBrick = (ball, brick) => brick.disableBody(true, true)
const hitPlayer = (ball, player) => {
  ball.setVelocityY(ball.body.velocity.y - 5)

  acceleration = Math.min(acceleration * 1.2, 3)
  ball.setVelocityX(
    (ball.x - player.x) * 3 * acceleration,
  )
}

export const start = async () => {
  const Phaser = await import(/* webpackChunkName: "phaser" */ 'phaser')
  let player, ball, bricks1, bricks2, bricks3, cursors
  let openingText, gameOverText, playerWonText
  let gameStarted = false

  function preload() {
    this.load.image('ball', ballSprite)
    this.load.image('paddle', paddleSprite)
    this.load.image('brick1', brick1Sprite)
    this.load.image('brick2', brick2Sprite)
    this.load.image('brick3', brick3Sprite)
  }

  function create() {
    const addText = (text, initial = false) => {
      text = this.add.text(
        this.physics.world.bounds.width * .5,
        this.physics.world.bounds.height * (initial ? .65 : .5),
        text,
        {
          fontFamily: 'Monaco, Courier, monospace',
          fontSize: '50px',
          align: 'center',
          fill: '#4fff71',
        },
      )
      text.setOrigin(.5)
      text.setVisible(initial)
      return text
    }

    openingText = addText('LEFT / RIGHT TO MOVE\nSPACE TO RELEASE', true)

    gameOverText = addText('GAME OVER :\'(')

    playerWonText = addText('!!! YOU WIN !!!')

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
      immovable: true,
      setXY: { x: 45, y: 50, stepX: 70 },
    })
    bricks3 = this.physics.add.group({
      key: 'brick3',
      repeat: 9,
      immovable: true,
      setXY: { x: 45, y: 120, stepX: 70 },
    })
    bricks2 = this.physics.add.group({
      key: 'brick2',
      repeat: 9,
      immovable: true,
      setXY: { x: 45, y: 190, stepX: 70 },
    })
    cursors = this.input.keyboard.createCursorKeys()
    player.setCollideWorldBounds(true)
    ball.setCollideWorldBounds(true)
    ball.setBounce(1, 1)
    this.physics.world.checkCollision.down = false
    const addColl =
      (bricks) => this.physics.add.collider(ball, bricks, hitBrick, null, this)
    addColl(bricks1)
    addColl(bricks2)
    addColl(bricks3)
    player.setImmovable(true)
    this.physics.add.collider(ball, player, hitPlayer, null, this)
  }

  const isGameOver = (world) => ball.body.y > world.bounds.height
  const isWon = () => bricks1.countActive() + bricks2.countActive() + bricks3.countActive() === 0

  function update() {
    if (!gameStarted) {
      ball.setX(player.x)

      if (cursors.space.isDown) {
        gameStarted = true
        openingText.setVisible(false)
        ball.setVelocityY(-200)
        ball.setVelocityX(-200 + 400 * Math.random())
      }
    }

    if (isGameOver(this.physics.world)) {
      [...bricks1.getChildren(), ...bricks2.getChildren(), ...bricks3.getChildren(), ball, player]
        .forEach(object => object.disableBody(true, true))
      gameOverText.setVisible(true)
    } else if (isWon()) {
      playerWonText.setVisible(true)
      ball.disableBody(true, true)
      player.disableBody(true, true)
    } else {
      if (cursors.left.isDown) {
        player.body.setVelocityX(-650)
      } else if (cursors.right.isDown) {
        player.body.setVelocityX(650)
      } else {
        player.body.setVelocityX(0)
      }
    }
  }

  for (let existingCanvas of document.getElementsByTagName('canvas')) {
    existingCanvas.remove()
  }

  game = new Phaser.Game({
    debug: true,
    type: Phaser.AUTO,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.93)',
    scene: { preload, create, update },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: false,
      },
    },
  })
}
