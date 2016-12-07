const request = require('request')

module.exports = function createGithubRelease (user, repo, token, body) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `https://api.github.com/repos/${user}/${repo}/releases`,
      headers: { 'User-Agent': 'electron-liberate' },
      qs: { access_token: token },
      body: JSON.stringify(body)
    }
    request.post(options, (err, res) => {
      if (err) return reject(err)
      try {
        let json = JSON.parse(res.body)
        if (json.errors) return reject(json)
        resolve(json)
      } catch (e) {
        reject(e)
      }
    })
  })
}
