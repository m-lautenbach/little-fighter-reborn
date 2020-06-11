const compNum = (a, b) => a - b

export default (r1, r2, matrix1, matrix2) => {
  ;[r1, r2] = [transformRect(r1, matrix1), transformRect(r2, matrix2)].map(r => ({
    x: [r.x, r.x + r.w].sort(compNum),
    y: [r.y, r.y + r.h].sort(compNum),
  }))

  const noIntersect = r2.x[0] > r1.x[1] || r2.x[1] < r1.x[0] ||
    r2.y[0] > r1.y[1] || r2.y[1] < r1.y[0]

  const x = Math.max(r1.x[0], r2.x[0])
  const y = Math.max(r1.y[0], r2.y[0])
  return noIntersect ? false : {
    x,
    y,
    w: Math.abs(x - Math.min(r1.x[1], r2.x[1])),
    h: Math.abs(y - Math.min(r1.y[1], r2.y[1])),
  }
}

function transformRect({ x: x1, y: y1, w, h }, matrix) {
  const x2 = x1 + w
  const y2 = y1 + h
  // transformation by matrix
  const p1 = matrix.getTransformedPoint(x1, y1)
  const p2 = matrix.getTransformedPoint(x2, y2)
  return {
    x: Math.min(p1.x, p2.x),
    y: Math.min(p1.y, p2.y),
    w: Math.abs(p1.x - p2.x),
    h: Math.abs(p1.y - p2.y),
  }
}
