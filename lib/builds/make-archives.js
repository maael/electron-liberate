const fs = require('fs')
const path = require('path')
const targzip = require('node-targz')

module.exports = function makeBuildArchives (inputDir, outputDir, buildFolders) {
  const builds = buildFolders.map((folder) => {
    return new Promise((resolve, reject) => {
      var buildOutput = path.join(outputDir, folder + '.tar.gz')
      targzip.compress({ source: path.join(inputDir, folder), destination: buildOutput },
        function (err) {
          if (err) return reject(err)
          resolve({ path: buildOutput })
        })
    })
  })
  return Promise.all(builds)
}
