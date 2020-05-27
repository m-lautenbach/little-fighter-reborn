const flow = require('lodash/flow')

const fixSlashes = (path) => path.replace(/\\/g, '/')
const fixImageFormat = (path) => path.replace(/\.bmp$/g, '.png')
const fix = flow(fixSlashes, fixImageFormat)

const fixRecursive = (object) => {
  for (let [key, value] of Object.entries(object)) {
    if (typeof value === 'string') {
      object[key] = fix(value)
    } else if (typeof value === 'object') {
      object[key] = fixRecursive(value)
    }
  }
  return object
}

module.exports = fixRecursive
