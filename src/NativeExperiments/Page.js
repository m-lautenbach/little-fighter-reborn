import React, { useEffect } from 'react'
import {
  add,
  always,
  evolve,
  map,
  pathOr,
  propOr,
  prop, once,
  assocPath, groupBy, last, assoc, pipe, cond, T, F,
} from 'ramda'
import { Typography } from 'antd'

import loadImage from './loadImage'

const { Title } = Typography

const dimensions = { width: 800, height: 600 }

const createCanvas = () => {
  const canvas = document.createElement('CANVAS')
  canvas.setAttribute('width', `${dimensions.width}px`)
  canvas.setAttribute('height', `${dimensions.height}px`)
  document.body.appendChild(canvas)
  return canvas
}

let assetCache = {}

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
  background: {
    color: '#ccfbff',
  },
  rendering: {
    frame: 0,
    imageSmoothing: true,
  },
  actors: [
    {
      character: 'freeze',
      position: { x: 20, y: 20 },
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
  console.log({ sheetData, frames })
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
  const { KeyW, KeyA, KeyS, KeyD } = inputState
  return (KeyA && KeyD || KeyW && KeyS || !KeyA && !KeyD && !KeyW && !KeyS) ? 'standing' : 'walking'
}

const updateDirection = (actor) => {
  const { KeyA, KeyD } = inputState
  return assoc('direction', KeyA && 'left' || KeyD && 'right' || actor.direction, actor)
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

const clearCanvas = (ctx) => ctx.fillRect(0, 0, dimensions.width, dimensions.height)

const drawActor = (ctx, actor) => () => {
  const { character, animation: { id: animationId, frame }, position: { x, y }, direction } = actor

  const { w, h } = assetCache.data.characters[character].bmp.frames_69
  const { [animationId]: { frames } } = getFrameMap()
  clearCanvas(ctx)
  const { x: sourceX, y: sourceY } = frames[frame]
  if (direction === 'left') {
    ctx.translate(x + 2 * w, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(assetCache.images.freezeSpritesheet, sourceX, sourceY, w, h, 0, y, 2 * w, 2 * h)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  } else {
    ctx.drawImage(assetCache.images.freezeSpritesheet, sourceX, sourceY, w, h, x, y, 2 * w, 2 * h)
  }
}

const render = (ctx, state) => () => {
  requestAnimationFrame(render(ctx, nextState(state)))
  ctx.imageSmoothingEnabled = pathOr(true, ['rendering', 'imageSmoothing'], state)
  ctx.fillStyle = pathOr('#ffffff', ['background', 'color'], state)
  clearCanvas(ctx)
  propOr([], 'actors', state).forEach(actor => drawActor(ctx, actor)())
}

const start = async () => {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  assetCache = assocPath(
    ['data', 'characters', 'freeze'],
    (await import('./assets/littlefighters2/freeze.lfdata')).default,
    assetCache,
  )
  assetCache = assocPath(
    ['images', 'freezeSpritesheet'],
    await loadImage(assetCache.data.characters.freeze.bmp.frames_69.file),
    assetCache,
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
      Native experiments
    </Title>
  </>
}
