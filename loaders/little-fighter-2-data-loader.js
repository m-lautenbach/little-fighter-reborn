const path = require('path')

const fixRecursive = require('../grammars/fixRecursive')
const loadParser = require('../grammars/loadParser')

module.exports = function (source) {
  const callback = this.async()
  const grammarPath = path.resolve(__dirname, '../grammars/lf-character.ne')

  this.addDependency(grammarPath)

  const parser = loadParser(grammarPath)
  parser.feed(source)

  callback(null, fixRecursive(parser.results[0]))
}
