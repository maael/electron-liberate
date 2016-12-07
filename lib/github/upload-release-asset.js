const fs = require('fs')
const path = require('path')
const request = require('request')

module.exports = function UploadGithubReleaseAsset (user, repo, token, release, contentType, build) {
  return new Promise((resolve, reject) => {
    let url = release.upload_url.replace('{?name,label}', '')
    let stats = fs.statSync(build.path)
    let options = {
      url,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size
      },
      qs: { name: path.parse(build.path).base, access_token: token }
    }
    fs.createReadStream(build.path).pipe(request.post(options, (err, res) => {
      if (err) return reject(res)
      resolve(res)
    }))
  })
}
