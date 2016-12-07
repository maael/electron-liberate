const UploadGithubReleaseAsset = require('./upload-release-asset')

module.exports = function UploadGithubReleaseAssets (user, repo, token, contentType, release, builds) {
  let assets = builds.map((build) => {
    return UploadGithubReleaseAsset(user, repo, token, release, contentType, build)
  })
  return Promise.all(assets)
}
