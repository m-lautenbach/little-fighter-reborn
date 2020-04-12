import { propOr } from 'ramda'

import drawBackground from './drawBackground'
import drawActor from './drawActor'

export default (ctx, state) => {
  drawBackground(ctx, state)
  propOr([], 'actors', state).forEach(actor => drawActor(ctx, actor, state)())
}
