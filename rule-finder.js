var path = require('path')
var fs = require('fs')

var eslint = require('eslint')
var isAbsolute = require('path-is-absolute')
var difference = require('lodash.difference')

function _getConfigFile(specifiedFile) {
  if (specifiedFile) {
    if (isAbsolute(specifiedFile)) {
      return specifiedFile
    } else {
      return path.join(process.cwd(), specifiedFile)
    }
  } else {
    // this is not being called with an arg. Use the package.json `main`
    return require(path.join(process.cwd(), 'package.json')).main
  }
}

function _getConfig(configFile) {
  var cliEngine = new eslint.CLIEngine({
    // ignore any config applicable depending on the location on the filesystem
    useEslintrc: false,
    // point to the particular config
    configFile: configFile, // eslint-disable-line object-shorthand
  })
  return cliEngine.getConfigForFile()
}

function _getCurrentRules() {
  var config = this.getConfig()
  return Object.keys(config.rules)
}

function _getPluginRules() {
  var config = this.getConfig()
  var pluginRules = []
  var plugins = config.plugins
  if (plugins) {
    plugins.forEach(function getPluginRule(plugin) {
      var pluginConfig = require('eslint-plugin-' + plugin)
      var rules = pluginConfig.rules
      pluginRules = pluginRules.concat(
        Object.keys(rules).map(function normalizePluginRule(rule) {
          return plugin + '/' + rule
        })
      )
    })
  }
  return pluginRules
}

function _getAllRules() {
  var pluginRules = this.getPluginRules()
  var allRules = fs
    .readdirSync('./node_modules/eslint/lib/rules')
    .map(function removeJsFromFilename(filename) {
      return filename.replace(/\.js$/, '')
    })

  allRules = allRules.concat(pluginRules)

  return allRules
}

var RuleFinder = function(specifiedFile) {
  var configFile = _getConfigFile(specifiedFile)
  var config = _getConfig(configFile)
  var currentRules
  var pluginRules
  var allRules

  this.getConfig = function() {
    return config
  }

  currentRules = _getCurrentRules.call(this)
  this.getCurrentRules = function() {
    return currentRules
  }

  pluginRules = _getPluginRules.call(this)
  this.getPluginRules = function() {
    return pluginRules
  }

  allRules = _getAllRules.call(this)
  this.getAllRules = function() {
    return allRules
  }
}

RuleFinder.prototype.getNewRules = function() {
  return difference(this.getAllRules(), this.getCurrentRules())
}

module.exports = RuleFinder
