const fs = require('fs')
const path = require('path')
const { once } = require('lodash')
const nearley = require('nearley')
const compile = require('nearley/lib/compile')
const generate = require('nearley/lib/generate')
const nearleyGrammar = require('nearley/lib/nearley-language-bootstrapped')

const compileGrammar = once((sourceCode) => {
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

const fixSlashes = (path) => path.replace(/\\/g, '/')

const fixSlashesRecursive = (object) => {
  for (let [key, value] of Object.entries(object)) {
    if (typeof value === 'string') {
      object[key] = fixSlashes(value)
    } else if (typeof value === 'object') {
      object[key] = fixSlashesRecursive(value)
    }
  }
  return object
}

module.exports = function (source) {
  const callback = this.async()
  const grammarPath = path.resolve(__dirname, 'lf-data-parser.ne')

  this.addDependency(grammarPath)

  fs.readFile(grammarPath, 'utf-8', function (err, grammarSource) {
    if (err) return callback(err)

    const grammar = compileGrammar(grammarSource)
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    try {
      parser.feed(source)
    } catch (e) {
      console.error(`Parsing failed for ${source}`)
      throw e
    }

    callback(null, fixSlashesRecursive(parser.results[0]))
  })
}
