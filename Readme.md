# electron-liberate

An electron release tool.

It does the following, in this order -

1. Runs [electron-packager](https://github.com/electron-userland/electron-packager)
2. Runs `npm version`
3. Pushes tags and commits with `git push --porcelain --follow-tags`
4. Creates a GitHub release
5. Creates `.tar.gz` of packages created by `electron-packager`
6. Uploads `.tar.gz` files and adds them to the created release

## Install
`npm install -g electron-liberate`

## Setup
A `.liberate` config file will need to be created for prjects which will use electron-liberate. This config must be -
```
GITHUB_USER=<user>
GITHUB_REPO=<repo name>
GITHUB_TOKEN=<personal access token>
```
with the right information filled out.

## Usage

### Basic
`liberate <version> <flags>`

### Help
```
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
```
