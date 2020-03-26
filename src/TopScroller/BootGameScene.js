import Phaser from 'phaser'

import backgroundImage from './assets/background.png'
import ship1SpriteSheet from './assets/ship1.png'
import ship2SpriteSheet from './assets/ship2.png'
import ship3SpriteSheet from './assets/ship3.png'
import explosionSpriteSheet from './assets/explosion.png'
import powerUpSpriteSheet from './assets/power-up.png'

export default class BootGameScene extends Phaser.Scene {
  constructor() {
    super('bootGame')
  }

  preload() {
    this.load.image('background', backgroundImage)
    this.load.spritesheet(
      'ship1',
      ship1SpriteSheet,
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    )
    this.load.spritesheet(
      'ship2',
      ship2SpriteSheet,
      {
        frameWidth: 32,
        frameHeight: 16,
      },
    )
    this.load.spritesheet(
      'ship3',
      ship3SpriteSheet,
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    )
    this.load.spritesheet(
      'explosion',
      explosionSpriteSheet,
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    )
    this.load.spritesheet(
      'power-up',
      powerUpSpriteSheet,
      {
        frameWidth: 16,
        frameHeight: 16
      }
    )
  }

  create() {
    this.add.text(20, 20, 'Loading game...')
    this.scene.start('playGame')
  }
}
