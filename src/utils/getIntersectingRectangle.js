const compNum = (a,b) => a - b

export default (r1, r2) => {
  [r1, r2] = [r1, r2].map(r => {
    return { x: [r.x, r.x + r.w].sort(compNum), y: [r.y, r.y + r.h].sort(compNum) }
  })

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
