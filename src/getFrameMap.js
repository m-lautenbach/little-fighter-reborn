import { groupBy, identity, last, map, memoizeWith, prop } from 'ramda'

import assetCache from './assetCache'

export default memoizeWith(identity, (character) => {
  const { bmp, frames } = assetCache.data.characters[character]
  const { w, h, row } = bmp.frames[0]
  const animations = groupBy(
    prop('animation'),
    map(
      value =>
        ({
          ...value,
          x: (value.pic % row) * (w + 1),
          y: Math.floor(value.pic / row) * (h + 1),
        }),
      frames,
    ),
  )
  return map(
    frames => {
      return {
        frames,
        loop: last(frames).next === 999 ? 'bounce' : 'last',
      }
    },
    animations,
  )
})
