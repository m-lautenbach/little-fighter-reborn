import { set } from 'lodash'

export default (peer, { type, actor }) => {
  if (type === 'update' && actor) {
    set(state, ['remotes', peer.id, 'actor'], actor)
  }
}
