import drawBackground from './drawBackground'
import drawActor from './drawActor'
import state from '../state'

export default (ctx) => {
  drawBackground(ctx)
  state.player.type = 'player'
  const actors = [
    state.player,
    ...Object.values(state.remotes).map(({ actor }) => ({
      ...actor,
      type: 'remote',
    })),
    ...Object.values(state.npcs).map(actor => ({ ...actor, type: 'npc' }))
  ]
  actors
    .sort(({ position: { y: y1 } }, { position: { y: y2 } }) => y2 - y1)
    .forEach(
      actor => drawActor(ctx, actor),
    )
}
