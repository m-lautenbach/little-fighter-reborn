const fs = require('fs')
const nearley = require('nearley')

const compileGrammar = require('../grammars/compileGrammar')

module.exports = (grammarPath) => {
  const grammarSource = fs.readFileSync(grammarPath, 'utf-8')

  const grammar = compileGrammar(grammarSource)
  return new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
}
