const packager = require('electron-packager')

module.exports = function package (options) {
  return new Promise((resolve, reject) => {
    packager(options, (err, appPaths) => {
      if (err) return reject(err)
      resolve(appPaths)
    })
  })
}
