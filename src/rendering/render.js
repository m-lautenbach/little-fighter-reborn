import drawBackground from './drawBackground'
import drawActor from './drawActor'
import state from '../state'

export default (ctx) => {
  drawBackground(ctx)
  const actors = [state.player, ...Object.values(state.remotes).map(({ actor }) => actor)]
  actors
    .sort(({ position: { y: y1 } }, { position: { y: y2 } }) => y2 - y1)
    .forEach(
      actor => drawActor(ctx, actor),
    )
}
