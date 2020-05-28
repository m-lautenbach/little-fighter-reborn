const fs = require('fs')

const [, , folderOrFile] = process.argv


const convertFile = filename => {
  console.log(filename)
  const source = fs.readFileSync(filename, 'utf8')
  const data = JSON.parse(source)
  delete data.header.frames

  fs.writeFileSync(
    filename,
    JSON.stringify(data, null, 2),
  )
}

if (fs.lstatSync(folderOrFile).isDirectory()) {
  fs.readdir(folderOrFile, (err, files) => {
    if (err) throw err
    files.forEach(file => file.endsWith('.json') && convertFile(file))
  })
} else {
  convertFile(folderOrFile)
}
