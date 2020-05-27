const fs = require('fs')
const path = require('path')

const fixRecursive = require('../grammars/fixRecursive')
const loadParser = require('../grammars/loadParser')

const [, , folderOrFile] = process.argv

const grammarPath = path.resolve(__dirname, '../grammars/lf-character.ne')

const getNewFilePath = filename =>
  `${filename.split('.')[0]}.json`

const convertFile = filename => {
  const parser = loadParser(grammarPath)
  const source = fs.readFileSync(filename, 'utf8')
  parser.feed(source)

  fs.writeFileSync(
    getNewFilePath(filename),
    JSON.stringify(fixRecursive(parser.results[0]), null, 2),
  )
}

if (fs.lstatSync(folderOrFile).isDirectory()) {
  fs.readdir(folderOrFile, (err, files) => {
    if (err) throw err
    files.forEach(file => file.endsWith('.lfdata') && convertFile(file))
  })
} else {
  convertFile(folderOrFile)
}
