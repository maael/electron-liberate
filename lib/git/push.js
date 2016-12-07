const spawn = require('child_process').spawn
const path = require('path')

module.exports = function gitPush (options) {
  return new Promise((resolve, reject) => {
    const gitOptions = [ 'push', '--porcelain' ]
    let output = []
    if (options && options.followTags) gitOptions.push('--follow-tags')
    const git = spawn('git', gitOptions)
    git.stdout.on('data', (data) => {
      output = handleData(data)
    })
    git.stderr.on('data', (data) => reject(data.toString()))
    git.on('close', (code) => resolve({ code: code.toString(), tags: output }))
  })
}

function handleData (data) {
  return data.toString()
    .split('\n')
    .map((line) => line.match(/:refs\/tags\/(.*)\t/))
    .filter((line) => line !== null)
    .map((match) => match[1])
}
