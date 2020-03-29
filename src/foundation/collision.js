import { prop, path, converge, add, pipe, subtract, nthArg, and, evolve } from 'ramda'
import { inRange } from 'lodash'

const argProp = (index, propName) => pipe(nthArg(index), prop(propName))

const circle = {
  center: { x: 0, y: 0 },
  radius: 22,
  velocity: { x: 0, y: 0 },
}

const left = path(['origin', 'x'])
const right = converge(add, [left, path(['dimensions', 'width'])])
const top = path(['origin', 'y'])
const bottom = converge(add, [right, path(['dimensions', 'height'])])

const hitTestPoint = converge(
  and(
    converge(
      inRange,
      [
        argProp(0, 'x'),
        pipe(nthArg(1), left),
        pipe(nthArg(1), right),
      ],
    ),
    converge(
      inRange,
      [
        argProp(0, 'y'),
        pipe(nthArg(1), top),
        pipe(nthArg(1), bottom),
      ],
    ),
  ),
)

const blockCircle = (circle1, { center: center2, radius: radius2 }) => {
  const { center: center1, radius: radius1 } = circle1
  const dx = center1.x - center2.x
  const dy = center1.y - center2.y
  const magnitude = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  const overlap = radius1 + radius2 - magnitude
  if (overlap > 0) {
    return evolve({
      x: add(overlap * dx / magnitude),
      y: add(overlap * dy / magnitude),
    }, circle1)
  }
  return circle1
}

const hitTestCircle = (circle1, circle2) => circle1 !== blockCircle(circle1, circle2)

const rectangle = {
  origin: { x: 0, y: 0 },
  dimensions: { width: 64, height: 64 },
  velocity: { x: 0, y: 0 },
}

const getCenter = ({ origin: { x, y }, dimensions: { width, height } }) => ({
  x: x + width / 2,
  y: y + height / 2,
})

function blockRectangle(rectangle1, rectangle2) {
  const center1 = getCenter(rectangle1)
  const center2 = getCenter(rectangle2)
  const vx = center1.x - center2.x
  const vy = center1.y - center2.y
  const overlapX = (rectangle1.width + rectangle2.width) / 2 - Math.abs(vx)
  const overlapY = (rectangle1.height + rectangle2.height) / 2 - Math.abs(vy)

  if (overlapX <= 0 && overlapY <= 0) {
    return { rectangle1 }
  }

  if (overlapX >= overlapY) {
    if (vy > 0) {
      return {
        collisionSide: 'top',
        rectangle1: evolve({ y: add(overlapY) })(rectangle1),
      }
    }
    return {
      collisionSide: 'bottom',
      rectangle1: evolve({ y: subtract(overlapY) })(rectangle1),
    }
  }
  if (vx > 0) {
    return {
      collisionSide: 'left',
      rectangle1: evolve({ x: add(overlapX) })(rectangle1),
    }
  }
  return {
    collisionSide: 'right',
    rectangle1: evolve({ x: subtract(overlapX) })(rectangle1),
  }
}

const hitTestRectangle =
  (rectangle1, rectangle2) =>
    Boolean(blockRectangle(rectangle1, rectangle2).collisionSide)

export {
  hitTestPoint,
  hitTestCircle,
  blockCircle,
  hitTestRectangle,
  blockRectangle,
}
