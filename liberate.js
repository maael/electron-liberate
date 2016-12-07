#!/usr/bin/env node

const path = require('path')
const meow = require('meow')
const dotenv = require('dotenv')
const npm = require('./lib/npm')
const builds = require('./lib/builds')
const gitPush = require('./lib/git/push')
const github = require('./lib/github')

dotenv.load({ path: '.liberate' })

const cli = meow(`
  Usage
    $ liberate <version>

  Options
    --build, -b Build directory of packages, used as --out for electron-packager
    --output, -o Output directory for zipped packages, if left blank will be the same as --build
    --name, -n Release name for GitHub
    --body Release body for GitHub
    --draft, -d If this the GitHub release should be a draft
    --prerelease, -pre If the GitHub release should be marked as prelease

  Electron Packager Options, for details see https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
    --dir
    --icon
    --platform
    --arch
    --all
    --appname
    --overwrite

  Examples
    $ liberate 2.0.0 -b build
  `,
  { alias:
    { b: 'build',
      o: 'output',
      n: 'name',
      d: 'draft',
      pre: 'prerelease'
    }
  })

if (cli.input[0]) {
  const input = path.resolve(process.cwd(), cli.flags.build)
  const output = path.resolve(process.cwd(), (cli.flags.output || cli.flags.build))
  const packagerOptions = {
    dir: path.resolve(process.cwd(), cli.flags.dir || ''),
    out: input,
    icon: path.resolve(process.cwd(), cli.flags.icon),
    platform: cli.flags.platform,
    arch: cli.flags.arch,
    all: cli.flags.all,
    name: cli.flags.appname,
    overwrite: cli.flags.hasOwnProperty('overwrite')
  }
  let release = {}
  builds.package(packagerOptions)
    .then(npm.load)
    .then(npm.version.bind(null, cli.input[0]))
    .then(gitPush.bind(null, { followTags: true }))
    .then((data) => {
      return ({
        tag_name: data.tags.pop(),
        name: cli.flags.name,
        body: cli.flags.body,
        draft: cli.flags.draft || false,
        prerelease: cli.flags.prerelease || false
      })
    })
    .then((body) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(body) }, 5000)
      })
    })
    .then(github.createRelease.bind(null, process.env.GITHUB_USER, process.env.GITHUB_REPO, process.env.GITHUB_TOKEN))
    .then((data) => { release = data })
    .then(builds.get.bind(null, input))
    .then(builds.makeArchives.bind(null, input, output))
    .then((builds) => {
      return new Promise((resolve, reject) => {
        github.uploadReleaseAssets(process.env.GITHUB_USER, process.env.GITHUB_REPO, process.env.GITHUB_TOKEN, 'application/tar', release, builds)
          .then(resolve)
          .catch(reject)
      })
    })
    .then((data) => {
      console.log('done')
    })
    .catch((err) => {
      console.log('Something broke')
      console.error(err)
    })
}
