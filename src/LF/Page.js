import React, { useEffect } from 'react'
import {
  add,
  always,
  evolve,
  map,
  pathOr,
  propOr,
  prop, once,
  groupBy, last, assoc, pipe, cond, T, F, range,
} from 'ramda'
import { Typography } from 'antd'

import loadImage from './loadImage'
import LionForest from './levels/LionForest'

const { Title } = Typography

const dimensions = { width: 800, height: 600 }

const createCanvas = () => {
  const canvas = document.createElement('CANVAS')
  canvas.setAttribute('width', `${dimensions.width}px`)
  canvas.setAttribute('height', `${dimensions.height}px`)
  document.body.appendChild(canvas)
  return canvas
}

let assetCache = {
  data: {
    characters: {},
  },
  images: {},
}

let inputState = {}

let initialState = {
  timestamp: Date.now(),
  debug: {
    draw: {
      boundingBox: true,
    },
  },
  world: {
    gravity: 980,
  },
  rendering: {
    frame: 0,
    imageSmoothing: true,
  },
  actors: [
    {
      character: 'freeze',
      position: { x: 100, y: 400 },
      direction: 'left',
      animation: {
        id: 'standing',
        frame: 0,
        bounced: false,
        start: Date.now(),
      },
    },
  ],
}

const getFrameMap = once(() => {
  const { bmp: sheetData, frames } = assetCache.data.characters.freeze
  const { w, h, row } = sheetData.frames_69
  const animations = groupBy(
    prop('animation'),
    map(
      value =>
        ({
          ...value,
          x: (value.pic % row) * (w + 1),
          y: Math.floor(value.pic / row) * (h + 1),
        }),
      frames,
    ),
  )
  return map(
    frames => {
      return {
        frames,
        loop: last(frames).next === 999 ? 'bounce' : 'last',
      }
    },
    animations,
  )
})

const getUpdatedAnimation = () => {
  const { KeyW, KeyA, KeyS, KeyD, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = inputState
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  const up = KeyW || ArrowUp
  const down = KeyS || ArrowDown
  return (left && right || up && down || !(left || right || up || down)) ? 'standing' : 'walking'
}

const updateDirection = (actor) => {
  const { KeyA, KeyD, ArrowLeft, ArrowRight } = inputState
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  return assoc('direction', left && !right && 'left' || right && !left && 'right' || actor.direction, actor)
}

const progressAnimation = (actor) => {
  const { animation: { id, frame, bounced, start } } = actor
  const { frames, loop } = getFrameMap()[id]
  const currentFrameEnded = (frames[frame].wait * 30) < (Date.now() - start)
  const isLastFrame = frame === (frames.length - 1)
  const updatedBounced = cond([
    [always(!bounced && isLastFrame), T],
    [always(bounced && frame === 0), F],
    [T, always(bounced)],
  ])()
  const nextFrame = loop === 'bounce' ?
    (updatedBounced ? frame - 1 : frame + 1) :
    (isLastFrame ? frame : frame + 1)
  return evolve({
    animation: pipe(
      assoc('frame', currentFrameEnded ? nextFrame : frame),
      assoc('start', currentFrameEnded ? Date.now() : start),
      assoc('bounced', updatedBounced),
    ),
  })(actor)
}

const updateAnimation = actor => {
  const { animation: { id } } = actor
  const updatedAnimation = getUpdatedAnimation()
  if (updatedAnimation !== id) {
    return evolve({
      animation: {
        frame: always(0),
        start: always(Date.now()),
        bounced: always(false),
        id: always(updatedAnimation),
      },
    })(actor)
  } else {
    return progressAnimation(actor)
  }
}

const nextState = (state) => {
  const newTimestamp = Date.now()
  const passedSeconds = (newTimestamp - state.timestamp) / 1000

  return evolve({
    timestamp: always(newTimestamp),
    rendering: {
      frame: add(1),
    },
    actors: map(
      pipe(
        updateAnimation,
        updateDirection,
      ),
    ),
    objects: map(
      (object) => {
        const updatePosition = (dimension) => ({
          [dimension]: add(
            passedSeconds *
            pathOr(0, ['velocity', dimension], object),
          ),
        })
        return evolve({
          velocity: {
            y: add(object.static ? 0 : passedSeconds * pathOr(0, ['world', 'gravity'], state)),
          },
          position: {
            ...updatePosition('x'),
            ...updatePosition('y'),
          },
        })(object)
      },
    ),
  })(state)
}

const drawBackground = (ctx) => {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, dimensions.width, dimensions.height / 2)
  ctx.fillStyle = '#104e10'
  ctx.fillRect(0, dimensions.height / 2, dimensions.width, dimensions.height)
  LionForest.layers.forEach(
    ({ x, y, loop, width }, index) => {
      const image = assetCache.images.lionForestLayers[index]
      ctx.drawImage(image, x, y)
      if (loop) {
        range(1, width / loop).forEach(
          index => {
            ctx.drawImage(image, x + index * loop, y)
          },
        )
      }
    },
  )
}

let shadowCache = {}

const drawActor = (ctx, actor) => () => {
  const { character, animation: { id: animationId, frame }, position: { x, y }, direction } = actor

  const { w, h } = assetCache.data.characters[character].bmp.frames_69
  const { [animationId]: { frames } } = getFrameMap()
  const { x: sourceX, y: sourceY } = frames[frame]

  const shadowCanvas = document.getElementById('image-manipulation')
  const ctx2 = shadowCanvas.getContext('2d')
  const spritesheet = assetCache.images.freezeSpritesheet
  ctx2.drawImage(spritesheet, sourceX, sourceY, w, h, 0, 0, w, h)
  let shadow
  if (shadowCache[frame]) {
    shadow = shadowCache[frame]
  } else {
    shadow = ctx2.getImageData(0, 0, w, h)
    shadow.data.forEach((value, index) => {
      // is color
      if ((index + 1) % 4 === 0) {
        // if not fully transparent
        if (value !== 0) {
          shadow.data[index] = 150
        }
      } else {
        // make black
        shadow.data[index] = 50
      }
    })
    shadowCache[frame] = shadow
  }

  ctx2.putImageData(shadow, 0, 0)
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  if (direction === 'left') {
    ctx.setTransform(-1, 0, .5, .5, x + (w / 2), y + (h / 2))
    ctx.drawImage(shadowCanvas, 0, 0)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.translate(x + w, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(spritesheet, sourceX, sourceY, w, h, 0, y, w, h)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  } else {
    ctx.setTransform(1, 0, .5, .5, x - (w / 2), y + (h / 2))
    ctx.drawImage(shadowCanvas, 0, 0)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(spritesheet, sourceX, sourceY, w, h, x, y, w, h)
  }
}

const render = (ctx, state) => () => {
  requestAnimationFrame(render(ctx, nextState(state)))
  ctx.imageSmoothingEnabled = pathOr(true, ['rendering', 'imageSmoothing'], state)
  drawBackground(ctx)
  propOr([], 'actors', state).forEach(actor => drawActor(ctx, actor)())
}

const start = async () => {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  assetCache.data.characters.freeze = (await import('./assets/littlefighters2/freeze.lfdata')).default
  assetCache.images.freezeSpritesheet = await loadImage(assetCache.data.characters.freeze.bmp.frames_69.file)
  assetCache.images.lionForestLayers = await Promise.all(
    LionForest.layers.map(({ img }) => loadImage(img)),
  )

  render(ctx, initialState)()
  document.onkeydown = ({ code }) => inputState[code] = Date.now()
  document.onkeyup = ({ code }) => delete inputState[code]
}

export default () => {
  useEffect(() => {
    const ignored = start()
  }, [])

  return <>
    <Title style={{ margin: '2rem' }}>
      LF2 Migration
    </Title>
    <canvas id="image-manipulation" width="100" height="200" style={{ position: 'absolute', left: -200, top: 0 }} />
  </>
}
