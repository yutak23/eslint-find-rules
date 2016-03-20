#!/usr/bin/env node

'use strict'

// Prints rules recognized by ESLint that don't appear in the given config
// preset. It helps with upgrading the preset when new ESLint gets released.
var path = require('path')
var eslint = require('eslint')
var isAbsolute = require('path-is-absolute')
var findNewRules = require('./index')

var configFile = getConfigFile()
var config = getConfig(configFile)

var currentRules = getCurrentRules(config)
var pluginRules = getPluginRules(config)

var newRules = findNewRules(currentRules, pluginRules)

if (newRules.length) {
  console.log('New rules to add to the config: ' + newRules.join(', ') + '.') // eslint-disable-line no-console
  process.exit(1)
}

function resolvePackagesMain(cwd, packageFile) {
  var packageFilePath = path.join(cwd, packageFile)
  var packageJson = require(packageFilePath)
  return packageJson.main
}

function getConfigFile() {
  var specifiedFile = process.argv[2]
  if (specifiedFile) {
    // this is being called like: eslint-find-new-rules eslint-config-mgol
    if (isAbsolute(specifiedFile)) {
      return specifiedFile
    } else {
      return path.join(process.cwd(), specifiedFile)
    }
  } else {
    // this is not being called with an arg. Use the package.json `main`
    return resolvePackagesMain(process.cwd(), 'package.json')
  }
}

function getConfig(file) {
  var cliEngine = new eslint.CLIEngine({
    // ignore any config applicable depending on the location on the filesystem
    useEslintrc: false,
    // point to the particular config
    configFile: file,
  })
  return cliEngine.getConfigForFile(file)
}

function getCurrentRules(conf) {
  var rules = Object.keys(conf.rules)
  return rules
}

function mapPluginRuleNames(plugin) {
  return function mapPluginNames(rule) {
    return plugin + '/' + rule
  }
}

function getPluginRules(conf) {
  var rules = []
  var plugins = conf.plugins
  if (plugins) {
    plugins.forEach(function normalizePluginRule(plugin) {
      var thisPluginsConfig = require('eslint-plugin-' + plugin)
      var thisPluginsRules = thisPluginsConfig.rules
      if (typeof thisPluginsRules === 'object') {
        rules = rules.concat(Object.keys(thisPluginsRules).map(mapPluginRuleNames(plugin)))
      }
    })
  }
  return rules
}
