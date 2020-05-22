import set from 'lodash/set'

import state from '../state'

export default ({ id, name }, { type, actor }) => {
  if (type === 'update' && actor) {
    set(state, ['remotes', id, 'actor'], { ...actor, name })
  }
}
