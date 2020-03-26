import Phaser from 'phaser'
import { random, range, sample } from 'lodash'

export default (gameDimensions) => class PlayGameScene extends Phaser.Scene {
  constructor() {
    super('playGame')
  }

  destroyShip(pointer, gameObject) {
    gameObject.setTexture('explosion')
    gameObject.play('explode')
  }

  create() {
    this.background =
      this.add.tileSprite(
        0, 0,
        gameDimensions.width,
        gameDimensions.height,
        'background',
      )
    this.background.setOrigin(0, 0)

    this.ship1 = this.add.sprite(
      gameDimensions.width / 2 - 50,
      gameDimensions.height / 2,
      'ship1',
    )
    this.ship2 = this.add.sprite(
      gameDimensions.width / 2,
      gameDimensions.height / 2,
      'ship2',
    )
    this.ship3 = this.add.sprite(
      gameDimensions.width / 2 + 50,
      gameDimensions.height / 2,
      'ship3',
    )

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion'),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    })

    const that = this
    range(1, 4).forEach(
      (index) => {
        that.anims.create({
          key: `ship${index}_anim`,
          frames: that.anims.generateFrameNumbers(`ship${index}`),
          frameRate: 20,
          repeat: -1,
        })
        this[`ship${index}`].play(`ship${index}_anim`)
        this[`ship${index}`].setInteractive()
      },
    )

    this.input.on('gameobjectdown', this.destroyShip, this)

    this.anims.create({
      key: 'red',
      frames: this.anims.generateFrameNumbers(
        'power-up',
        { start: 0, end: 1 },
      ),
      frameRate: 20,
      repeat: -1,
    })
    this.anims.create({
      key: 'gray',
      frames: this.anims.generateFrameNumbers(
        'power-up',
        { start: 2, end: 3 },
      ),
      frameRate: 20,
      repeat: -1,
    })

    this.powerUps = this.physics.add.group()

    range(4).forEach(() => {
      const powerUp = this.physics.add.sprite(16, 16, 'power-up')
      this.powerUps.add(powerUp)
      powerUp.setRandomPosition(
        0, 0,
        gameDimensions.width,
        gameDimensions.height,
      )

      powerUp.play(sample(['red', 'gray']))
      powerUp.setVelocity(100, 100)
      powerUp.setCollideWorldBounds(true)
      powerUp.setBounce(1)
    })
  }

  resetShipPosition(ship) {
    ship.y = 0
    ship.x = random(10, gameDimensions.width - 10)
  }

  moveShip(ship, speed) {
    ship.y += speed
    if (ship.y > gameDimensions.height) {
      this.resetShipPosition(ship)
    }
  }

  update() {
    this.moveShip(this.ship1, 3)
    this.moveShip(this.ship2, 2)
    this.moveShip(this.ship3, 1)

    this.background.tilePositionY -= .5
  }
}
