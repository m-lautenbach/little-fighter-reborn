import state from '../state'
import { set } from 'lodash'

export default ({ id }, { type, actor }) => {
  if (type === 'update' && actor) {
    set(state, ['remotes', id, 'actor'], actor)
  }
}
