import { prop, converge, add, pipe, applySpec, multiply } from 'ramda'
import { inRange } from 'lodash'

const collisionRectangle = {
  x: 0,
  y: 0,
  width: 64,
  height: 64,
  velocity: { x: 0, y: 0 },
}

const collisionCircle = {
  center: { x: 0, y: 0 },
  radius: 22,
  velocity: { x: 0, y: 0 },
}

const left = prop('x')
const right = converge(add, [prop('x'), prop('width')])
const top = prop('y')
const bottom = converge(add, [prop('y'), prop('height')])

const hitTestPoint = (pointX, pointY, sprite) =>
  inRange(pointX, left(sprite), right(sprite)) &&
  inRange(pointY, top(sprite), bottom(sprite))

const pointDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

const hitTestCircle =
  ({ center: center1, radius: radius1 }, { center: center2, radius: radius2 }) =>
    pointDistance(center1, center2) < radius1 + radius2
