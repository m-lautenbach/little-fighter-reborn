import { clamp } from 'ramda'

const getDistanceBetween = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

const circleBodyIntersects = (circle, body) => {
  const x = clamp(circle.center.x, body.left, body.right)
  const y = clamp(circle.center.y, body.top, body.bottom)

  const dx = (circle.center.x - x) * (circle.center.x - x)
  const dy = (circle.center.y - y) * (circle.center.y - y)

  return (dx + dy) <= (circle.radius * circle.radius)
}

const intersects = (body1, body2) => {
  if (!body1.isCircle && !body2.isCircle) {
    return !(
      body1.right <= body2.position.x ||
      body1.bottom <= body2.position.y ||
      body1.position.x >= body2.right ||
      body1.position.y >= body2.bottom
    )
  } else if (body1.isCircle) {
    if (body2.isCircle) {
      return getDistanceBetween(body1.center.x, body1.center.y, body2.center.x, body2.center.y) <= (body1.halfWidth + body2.halfWidth)
    } else {
      return circleBodyIntersects(body1, body2)
    }
  } else {
    return circleBodyIntersects(body2, body1)
  }
}

const getOverlapX = (body1, body2, overlapOnly, bias) => {
  let overlap = 0
  const maxOverlap = body1.deltaAbsX() + body2.deltaAbsX() + bias

  if (body1._dx === 0 && body2._dx === 0) {
    //  They overlap but neither of them are moving
    body1.embedded = true
    body2.embedded = true
  } else if (body1._dx > body2._dx) {
    //  Body1 is moving right and / or Body2 is moving left
    overlap = body1.right - body2.x

    if ((overlap > maxOverlap && !overlapOnly) || body1.checkCollision.right === false || body2.checkCollision.left === false) {
      overlap = 0
    }
  } else if (body1._dx < body2._dx) {
    //  Body1 is moving left and/or Body2 is moving right
    overlap = body1.x - body2.width - body2.x

    if ((-overlap > maxOverlap && !overlapOnly) || body1.checkCollision.left === false || body2.checkCollision.right === false) {
      overlap = 0
    }
  }

  return overlap
}

const separateCircle = (body1, body2, overlapOnly, bias) => {
  //  Set the bounding box overlap values into the bodies themselves (hence we don't use the return values here)
  getOverlapX(body1, body2, false, bias)
  GetOverlapY(body1, body2, false, bias)

  let overlap = 0

  if (body1.isCircle !== body2.isCircle) {
    const rect = {
      x: (body2.isCircle) ? body1.position.x : body2.position.x,
      y: (body2.isCircle) ? body1.position.y : body2.position.y,
      right: (body2.isCircle) ? body1.right : body2.right,
      bottom: (body2.isCircle) ? body1.bottom : body2.bottom,
    }

    const circle = {
      x: (body1.isCircle) ? body1.center.x : body2.center.x,
      y: (body1.isCircle) ? body1.center.y : body2.center.y,
      radius: (body1.isCircle) ? body1.halfWidth : body2.halfWidth,
    }

    if (circle.y < rect.y) {
      if (circle.x < rect.x) {
        overlap = DistanceBetween(circle.x, circle.y, rect.x, rect.y) - circle.radius
      } else if (circle.x > rect.right) {
        overlap = DistanceBetween(circle.x, circle.y, rect.right, rect.y) - circle.radius
      }
    } else if (circle.y > rect.bottom) {
      if (circle.x < rect.x) {
        overlap = DistanceBetween(circle.x, circle.y, rect.x, rect.bottom) - circle.radius
      } else if (circle.x > rect.right) {
        overlap = DistanceBetween(circle.x, circle.y, rect.right, rect.bottom) - circle.radius
      }
    }

    overlap *= -1
  } else {
    overlap = (body1.halfWidth + body2.halfWidth) - DistanceBetween(body1.center.x, body1.center.y, body2.center.x, body2.center.y)
  }

  //  Can't separate two immovable bodies, or a body with its own custom separation logic
  if (overlapOnly || overlap === 0 || (body1.immovable && body2.immovable) || body1.customSeparateX || body2.customSeparateX) {

    //  return true if there was some overlap, otherwise false
    return (overlap !== 0)
  }

  const dx = body1.center.x - body2.center.x
  const dy = body1.center.y - body2.center.y
  const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  const nx = ((body2.center.x - body1.center.x) / d) || 0
  const ny = ((body2.center.y - body1.center.y) / d) || 0
  const p = 2 * (body1.velocity.x * nx + body1.velocity.y * ny - body2.velocity.x * nx - body2.velocity.y * ny) / (body1.mass + body2.mass)

  if (!body1.immovable) {
    body1.velocity.x = (body1.velocity.x - p * body1.mass * nx)
    body1.velocity.y = (body1.velocity.y - p * body1.mass * ny)
  }

  if (!body2.immovable) {
    body2.velocity.x = (body2.velocity.x + p * body2.mass * nx)
    body2.velocity.y = (body2.velocity.y + p * body2.mass * ny)
  }

  const dvx = body2.velocity.x - body1.velocity.x
  const dvy = body2.velocity.y - body1.velocity.y
  const angleCollision = Math.atan2(dvy, dvx)

  const delta = 1 / 60

  if (!body1.immovable && !body2.immovable) {
    overlap /= 2
  }

  if (!body1.immovable) {
    body1.x += (body1.velocity.x * delta) - overlap * Math.cos(angleCollision)
    body1.y += (body1.velocity.y * delta) - overlap * Math.sin(angleCollision)
  }

  if (!body2.immovable) {
    body2.x += (body2.velocity.x * delta) + overlap * Math.cos(angleCollision)
    body2.y += (body2.velocity.y * delta) + overlap * Math.sin(angleCollision)
  }

  body1.velocity.x *= body1.bounce.x
  body1.velocity.y *= body1.bounce.y
  body2.velocity.x *= body2.bounce.x
  body2.velocity.y *= body2.bounce.y

  return true
}

export const separate = (body1, body2, processCallback, callbackContext, overlapOnly) => {
  if (
    !body1.enable ||
    !body2.enable ||
    body1.checkCollision.none ||
    body2.checkCollision.none ||
    !intersects(body1, body2)) {
    return false
  }

  //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
  if (processCallback && processCallback.call(callbackContext, body1.gameObject, body2.gameObject) === false) {
    return false
  }

  //  Circle vs. Circle quick bail out
  if (body1.isCircle && body2.isCircle) {
    return separateCircle(body1, body2, overlapOnly)
  }

  // We define the behavior of bodies in a collision circle and rectangle
  // If a collision occurs in the corner points of the rectangle, the body behave like circles

  //  Either body1 or body2 is a circle
  if (body1.isCircle !== body2.isCircle) {
    const bodyRect = (body1.isCircle) ? body2 : body1
    const bodyCircle = (body1.isCircle) ? body1 : body2

    const rect = {
      x: bodyRect.x,
      y: bodyRect.y,
      right: bodyRect.right,
      bottom: bodyRect.bottom,
    }

    const circle = bodyCircle.center

    if (circle.y < rect.y || circle.y > rect.bottom) {
      if (circle.x < rect.x || circle.x > rect.right) {
        return separateCircle(body1, body2, overlapOnly)
      }
    }
  }

  let resultX = false
  let resultY = false

  //  Do we separate on x or y first?
  if (forceX || Math.abs(gravity.y + body1.gravity.y) < Math.abs(gravity.x + body1.gravity.x)) {
    resultX = SeparateX(body1, body2, overlapOnly, OVERLAP_BIAS)

    //  Are they still intersecting? Let's do the other axis then
    if (intersects(body1, body2)) {
      resultY = SeparateY(body1, body2, overlapOnly, OVERLAP_BIAS)
    }
  } else {
    resultY = SeparateY(body1, body2, overlapOnly, OVERLAP_BIAS)

    //  Are they still intersecting? Let's do the other axis then
    if (intersects(body1, body2)) {
      resultX = SeparateX(body1, body2, overlapOnly, OVERLAP_BIAS)
    }
  }

  return resultX || resultY
}

export const collideSpriteVsSprite = (sprite1, sprite2, collideCallback, processCallback, callbackContext, overlapOnly) => {
  if (separate(sprite1.body, sprite2.body, processCallback, callbackContext, overlapOnly)) {
    if (collideCallback) {
      collideCallback.call(callbackContext, sprite1, sprite2)
    }
  }

  return true
}

export const collideObjects = (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly) => {
  return collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly)
}
