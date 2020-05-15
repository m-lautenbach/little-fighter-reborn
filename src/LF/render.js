import drawBackground from './drawBackground'
import drawActor from './drawActor'
import state from './state'

export default (ctx) => {
  drawBackground(ctx)
  state.actors.forEach(actor => drawActor(ctx, actor))
}
