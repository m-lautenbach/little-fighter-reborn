import Phaser from 'phaser'

export default class Beam extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    const { x, y } = scene.player

    super(scene, x, y - 4, 'projectile')

    this.play('shoot')
    scene.physics.world.enableBody(this)
    this.body.velocity.y = -250
  }

  update() {
    if (this.y < -32) {
      this.destroy()
    }
  }
}

