const TransformationMatrix = (_m = [1, 0, 0, 1, 0, 0]) => {
  let m = [..._m]
  let im

  const multiply = function (mat) {
    const m0 = m[0] * mat[0] + m[2] * mat[1]
    const m1 = m[1] * mat[0] + m[3] * mat[1]
    const m2 = m[0] * mat[2] + m[2] * mat[3]
    const m3 = m[1] * mat[2] + m[3] * mat[3]
    const m4 = m[0] * mat[4] + m[2] * mat[5] + m[4]
    const m5 = m[1] * mat[4] + m[3] * mat[5] + m[5]
    m = [m0, m1, m2, m3, m4, m5]
  }
  const screenPoint = function (transformedX, transformedY) {
    // invert
    const d = 1 / (m[0] * m[3] - m[1] * m[2])
    im = [m[3] * d, -m[1] * d, -m[2] * d, m[0] * d, d * (m[2] * m[5] - m[3] * m[4]), d * (m[1] * m[4] - m[0] * m[5])]
    // point
    return ({
      x: transformedX * im[0] + transformedY * im[2] + im[4],
      y: transformedX * im[1] + transformedY * im[3] + im[5],
    })
  }
  const transformedPoint = function (screenX, screenY) {
    return ({
      x: screenX * m[0] + screenY * m[2] + m[4],
      y: screenX * m[1] + screenY * m[3] + m[5],
    })
  }

  const reset = function () {
    m = [1, 0, 0, 1, 0, 0]
  }
  const translate = function (x, y) {
    const mat = [1, 0, 0, 1, x, y]
    multiply(mat)
  }
  const rotate = function (rAngle) {
    const c = Math.cos(rAngle)
    const s = Math.sin(rAngle)
    const mat = [c, s, -s, c, 0, 0]
    multiply(mat)
  }
  const scale = function (x, y) {
    const mat = [x, 0, 0, y, 0, 0]
    multiply(mat)
  }
  const skew = function (radianX, radianY) {
    const mat = [1, Math.tan(radianY), Math.tan(radianX), 1, 0, 0]
    multiply(mat)
  }
  const setContextTransform = function (ctx) {
    ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
  }
  const resetContextTransform = function (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
  const getTransformedPoint = function (screenX, screenY) {
    return (transformedPoint(screenX, screenY))
  }
  const getScreenPoint = function (transformedX, transformedY) {
    return (screenPoint(transformedX, transformedY))
  }
  const getMatrix = () => [...m]
  const clone = () => TransformationMatrix(m)

  return ({
    reset,
    translate,
    rotate,
    scale,
    skew,
    setContextTransform,
    resetContextTransform,
    getTransformedPoint,
    getScreenPoint,
    getMatrix,
    clone,
  })
}

export default TransformationMatrix
