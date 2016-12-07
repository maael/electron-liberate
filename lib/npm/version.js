const npm = require('npm')

module.exports = function npmVersion (version) {
  return new Promise((resolve, reject) => {
    npm.commands.version([ version.toString() ], function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
