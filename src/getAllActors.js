import state from './state'

export default () => [
  state.player,
  ...Object.values(state.remotes).map(({ actor }) => {
    actor.type = 'remote'
    return actor
  }),
  ...Object.values(state.npcs).map(actor => {
    actor.type = 'npc'
    return actor
  }),
]
