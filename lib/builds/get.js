const fs = require('fs')
const path = require('path')

module.exports = function getBuilds (buildsDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(buildsDir), (err, files) => {
      if (err) return reject(err)
      const buildFolders = files.filter((file) => fs.statSync(path.join(buildsDir, file)).isDirectory())
      resolve(buildFolders)
    })
  })
}
