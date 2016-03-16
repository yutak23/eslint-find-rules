var fs = require('fs')
var difference = require('lodash.difference')

module.exports = findNewRules

function findNewRules(currentRules) {
  var allRules = fs
    .readdirSync('./node_modules/eslint/lib/rules')
    .map(filename => filename.replace(/\.js$/, ''))

  return difference(allRules, currentRules)
}

