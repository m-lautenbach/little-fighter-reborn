import { range } from 'ramda'

export const getFrameRange =
  (key, start, end) => range(start, end).map((frame) => ({ key, frame }))

export const getAllFrames =
  (key, textures) => getFrameRange(key, 0, textures.get(key).frameTotal - 1)
