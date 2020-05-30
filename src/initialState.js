import sample from 'lodash/sample'

import characters from './characters'

export default {
  timestamp: Date.now(),
  debug: {
    draw: {
      center: false,
      hitboxes: false,
    },
  },
  world: {
    gravity: -980,
    boundaries: {
      yMin: 10,
      yMax: 470,
    },
  },
  camera: {
    x: 0,
    xMax: 2200,
  },
  rendering: {
    frame: 0,
    imageSmoothing: false,
    width: 800, height: 600,
  },
  remotes: {},
  npcs: {
    0: {
      name: 'NPC1',
      character: sample(characters),
      position: { x: 500, y: 200, z: 0 },
      direction: 'left',
    },
  },
  player: {
    character: sample(characters),
    position: { x: Math.random() * 300, y: Math.random() * 470, z: Math.random() * 200 },
    direction: 'right',
  },
}
