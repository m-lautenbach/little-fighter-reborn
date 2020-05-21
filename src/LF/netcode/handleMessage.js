import state from '../state'
import { set } from 'lodash'

export default ({ id, name }, { type, actor }) => {
  if (type === 'update' && actor) {
    set(state, ['remotes', id, 'actor'], { ...actor, name })
  }
}
