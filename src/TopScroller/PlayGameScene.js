import Phaser from 'phaser'
import { random, range, sample, padStart } from 'lodash'
import Projectile from './Projectile'
import Explosion from './Explosion'

const gameSettings = {
  playerSpeed: 200,
}

export default (gameDimensions) => class PlayGameScene extends Phaser.Scene {
  constructor() {
    super('playGame')
  }

  pickPowerUp(_, powerUp) {
    powerUp.disableBody(true, true)
    this.score += 50
  }

  resetPlayer() {
    this.player.enableBody(
      true,
      gameDimensions.width / 2 - 8,
      gameDimensions.height + 64,
      true,
      true,
    )

    this.tweens.add({
      targets: this.player,
      y: gameDimensions.height - 64,
      ease: 'Power1',
      duration: 1500,
      repeat: 0,
      onComplete: () => {
        this.player.alpha = 1
      },
      callbackScope: this,
    })
  }

  hurtPlayer(player, enemy) {
    if (this.player.alpha < 1) {
      return
    }
    this.player.alpha = .5

    new Explosion(this, enemy.x, enemy.y)
    this.resetShipPosition(enemy)
    this.score = Math.max(0, this.score - 100)

    player.disableBody(true, true)
    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false,
    })
  }

  hitEnemy(projectile, enemy) {
    new Explosion(this, enemy.x, enemy.y)

    projectile.destroy()
    this.resetShipPosition(enemy)
    this.score += 15
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

    this.enemies = this.physics.add.group()
    this.enemies.add(this.ship1)
    this.enemies.add(this.ship2)
    this.enemies.add(this.ship3)

    this.powerUps = this.physics.add.group()

    range(1, 4).forEach(
      (index) => {
        this[`ship${index}`].play(`ship${index}_anim`)
        this[`ship${index}`].setInteractive()
      },
    )

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

    this.player = this.physics.add.sprite(
      gameDimensions.width / 2 - 8,
      gameDimensions.height - 64,
      'player',
    )
    this.player.play('thrust')
    this.cursorKeys = this.input.keyboard.createCursorKeys()
    this.player.setCollideWorldBounds(true)

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.projectiles = this.add.group()

    this.physics.add.collider(
      this.projectiles,
      this.powerUps,
      (projectile) => projectile.destroy(),
    )
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.pickPowerUp,
      null, this,
    )
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hurtPlayer,
      null, this,
    )
    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.hitEnemy,
      null, this,
    )

    const graphics = this.add.graphics()
    graphics.fillStyle('#000', 1)
    graphics.fillRect(0, 0, gameDimensions.width, 20)

    this.score = 0
    this.scoreLabel = this.add.bitmapText(10, 5, 'pixelFont', '', 16)
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

  movePlayer() {
    if (this.player.alpha < 1) {
      return
    }
    if (this.cursorKeys.left.isDown && !this.cursorKeys.right.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed)
    } else if (this.cursorKeys.right.isDown && !this.cursorKeys.left.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed)
    } else {
      this.player.setVelocityX(0)
    }

    if (this.cursorKeys.up.isDown && !this.cursorKeys.down.isDown) {
      this.player.setVelocityY(-gameSettings.playerSpeed)
    } else if (this.cursorKeys.down.isDown && !this.cursorKeys.up.isDown) {
      this.player.setVelocityY(gameSettings.playerSpeed)
    } else {
      this.player.setVelocityY(0)
    }
  }

  shoot() {
    if (this.player.alpha < 1) {
      return
    }
    const projectile = new Projectile(this)
    this.add.existing(projectile)
    this.projectiles.add(projectile)
  }

  update() {
    this.moveShip(this.ship1, 3)
    this.moveShip(this.ship2, 2)
    this.moveShip(this.ship3, 1)

    this.background.tilePositionY -= .5

    this.movePlayer()

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.shoot()
    }
    this.projectiles.getChildren().forEach(
      projectile => projectile.update(),
    )
    this.scoreLabel.text = `SCORE ${padStart(this.score, 6, '0')}`
  }
}
