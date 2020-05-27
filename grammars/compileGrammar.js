const { memoize } = require('lodash')
const nearley = require('nearley')

const compile = require('nearley/lib/compile')
const generate = require('nearley/lib/generate')
const nearleyGrammar = require('nearley/lib/nearley-language-bootstrapped')

module.exports = memoize((sourceCode) => {
  // Parse the grammar source into an AST
  const grammarParser = new nearley.Parser(nearleyGrammar)
  grammarParser.feed(sourceCode)
  const grammarAst = grammarParser.results[0]

  // Compile the AST into a set of rules
  const grammarInfoObject = compile(grammarAst, {})
  // Generate JavaScript code from the rules
  const grammarJs = generate(grammarInfoObject, 'grammar')

  // Pretend this is a CommonJS environment to catch exports from the grammar.
  const module = { exports: {} }
  eval(grammarJs)

  return module.exports
})
