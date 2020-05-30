const color = {
  player: '#c4c4c4',
  npc: '#ff91ab',
  remote: '#9191ff',
}

export default (ctx, { type, name }) => {
  ctx.save()
  ctx.imageSmoothingEnabled = true
  ctx.shadowColor = 'rgba(0,0,0,1)'
  ctx.shadowBlur = 3
  ctx.fillStyle = color[type]
  ctx.font = '11px sans-serif'
  ctx.lineWidth = 2
  ctx.textAlign = 'center'
  ctx.fillText(type === 'player' ? 'YOU' : name, 0, 12)
  ctx.restore()
}
