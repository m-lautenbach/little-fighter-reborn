import { identity, map, memoizeWith } from 'ramda'

import assetCache from './assetCache'

export default memoizeWith(identity, (character) => {
  const { header, animations } = assetCache.data.characters[character]
  const { w, h, row } = header.frames[0]
  return map(
    frames => {
      return {
        frames: frames.map(value => ({
          ...value,
          x: (value.pic % row) * (w + 1),
          y: Math.floor(value.pic / row) * (h + 1),
        })),
        // walking animation is special and it's not really reflected in data files
        bounce: frames[0].animation === 'walking',
      }
    },
    animations,
  )
})
