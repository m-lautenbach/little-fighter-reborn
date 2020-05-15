import drawBackground from './drawBackground'
import drawActor from './drawActor'
import state from './state'

export default (ctx) => {
  drawBackground(ctx)
  drawActor(ctx, state.player)
  Object.values(state.remotes).forEach(
    ({ actor }) => drawActor(ctx, actor),
  )
}
