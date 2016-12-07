const npm = require('npm')

module.exports = function npmLoad () {
  return new Promise((resolve, reject) => {
    npm.load({}, function (err, npm) {
      if (err) return reject(err)
      resolve(npm)
    })
  })
}
