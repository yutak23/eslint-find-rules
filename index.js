var fs = require('fs')
var difference = require('lodash.difference')

module.exports = findNewRules

function findNewRules(currentRules) {
  var allRules = fs
    .readdirSync('./node_modules/eslint/lib/rules')
    .map(function removeJsFromFilename(filename) {
      return filename.replace(/\.js$/, '')
    })

  return difference(allRules, currentRules)
}

