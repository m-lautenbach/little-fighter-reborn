import { groupBy, last, map, once, prop } from 'ramda'

import assetCache from './assetCache'

export default once(() => {
  const { bmp: sheetData, frames } = assetCache.data.characters.freeze
  const { w, h, row } = sheetData.frames_69
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
