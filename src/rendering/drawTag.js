export default (ctx, name) => {
  ctx.save()
  ctx.imageSmoothingEnabled = true
  ctx.shadowColor = 'rgba(0,0,0,1)'
  ctx.shadowBlur = 3
  ctx.fillStyle = name ? '#9191ff' : '#c4c4c4'
  ctx.font = '11px sans-serif'
  ctx.lineWidth = 2
  ctx.textAlign = 'center'
  ctx.fillText(name || 'YOU', 0, 12)
  ctx.restore()
}
