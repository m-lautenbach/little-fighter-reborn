import state from '../state'
import getAllActors from '../getAllActors'

import drawBackground from './drawBackground'
import drawActor from './drawActor'

export default (ctx) => {
  drawBackground(ctx)
  state.player.type = 'player'
  const actors = getAllActors()
  actors
    .sort(({ position: { y: y1 } }, { position: { y: y2 } }) => y2 - y1)
    .forEach(
      actor => drawActor(ctx, actor),
    )
}
