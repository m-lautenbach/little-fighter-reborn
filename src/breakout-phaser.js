import * as Phaser from 'phaser'

function preload() {
}

function create() {
}

let game

export const start = () => {
  for (let existingCanvas of document.getElementsByTagName('canvas')) {
    existingCanvas.remove()
  }

  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
    },
    scene: {
      preload: preload,
      create: create,
    },
  })
}

export const stop = () => {
  if (game) {
    game.stopped = true
  }
}
