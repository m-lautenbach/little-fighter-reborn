import { sample } from 'lodash'

import characters from './characters'

export default {
  timestamp: Date.now(),
  debug: {
    draw: {
      center: false,
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
  player: {
    character: sample(characters),
    velocity: { x: 0, y: 0, z: 0 },
    position: { x: Math.random() * 700, y: Math.random() * 470, z: Math.random() * 200 },
    direction: Math.random() > .5 ? 'right' : 'left',
    dimensions: {
      width: 79,
      height: 79,
    },
    animation: {
      id: 'standing',
      frame: 0,
      start: Date.now(),
    },
  },
}
