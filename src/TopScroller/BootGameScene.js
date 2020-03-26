import Phaser from 'phaser'
import { range } from 'lodash'

import backgroundImage from './assets/background.png'
import ship1SpriteSheet from './assets/ship1.png'
import ship2SpriteSheet from './assets/ship2.png'
import ship3SpriteSheet from './assets/ship3.png'
import explosionSpriteSheet from './assets/explosion.png'
import powerUpSpriteSheet from './assets/power-up.png'
import playerSpriteSheet from './assets/player.png'
import projectileSpriteSheet from './assets/projectile.png'
import fontSpriteSheet from './assets/font.png'
import fontXML from './assets/font.xml'
import { getAllFrames, getFrameRange } from '../utils/frames'

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
        frameHeight: 16,
      },
    )
    this.load.spritesheet(
      'player',
      playerSpriteSheet,
      {
        frameWidth: 16,
        frameHeight: 24,
      },
    )
    this.load.spritesheet(
      'projectile',
      projectileSpriteSheet,
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    )

    this.load.bitmapFont('pixelFont', fontSpriteSheet, fontXML)
  }

  create() {
    this.add.text(20, 20, 'Loading game...')

    this.anims.create({
      key: 'red',
      frames: getFrameRange('power-up', 0, 1),
      frameRate: 20,
      repeat: -1,
    })
    this.anims.create({
      key: 'gray',
      frames: getFrameRange('power-up', 2, 3),
      frameRate: 20,
      repeat: -1,
    })

    this.anims.create({
      key: 'explode',
      frames: getAllFrames('explosion', this.textures),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    })

    const that = this
    range(1, 4).forEach(
      (index) => {
        that.anims.create({
          key: `ship${index}_anim`,
          frames: getAllFrames(`ship${index}`, this.textures),
          frameRate: 20,
          repeat: -1,
        })
      },
    )

    this.anims.create({
      key: 'thrust',
      frames: getAllFrames('player', this.textures),
      frameRate: 20,
      repeat: -1,
    })

    this.anims.create({
      key: 'shoot',
      frames: getAllFrames('projectile', this.textures),
      frameRate: 20,
      repeat: -1,
    })

    this.scene.start('playGame')
  }
}
