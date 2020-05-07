export default {
  timestamp: Date.now(),
  debug: {
    draw: {
      boundingBox: true,
    },
  },
  world: {
    gravity: 980,
  },
  camera: {
    x: 0,
    xMax: 2200,
  },
  rendering: {
    frame: 0,
    imageSmoothing: false,
    width: 800, height: 600
  },
  actors: [
    {
      character: 'freeze',
      position: { x: 200, y: 100, z: 100 },
      direction: 'right',
      animation: {
        id: 'standing',
        frame: 0,
        bounced: false,
        start: Date.now(),
      },
    },
  ],
}
