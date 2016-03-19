#!/usr/bin/env node

'use strict'

// Prints rules recognized by ESLint that don't appear in the given config
// preset. It helps with upgrading the preset when new ESLint gets released.
var path = require('path')
var eslint = require('eslint')
var isAbsolute = require('path-is-absolute')
var findNewRules = require('./index')

var currentRules = getRules()
var newRules = findNewRules(currentRules)

if (newRules.length) {
  console.log('New rules to add to the config: ' + newRules.join(', ') + '.') // eslint-disable-line no-console
  process.exit(1)
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
    return path.join(process.cwd(), 'package.json')
  }
}

function getConfig(file) {
  var cliEngine = new eslint.CLIEngine({
    // ignore any config applicable depending on the location on the filesystem
    useEslintrc: false,
    // point to the particular config
    configFile: file,
  })
  var config = cliEngine.getConfigForFile(file)
  return config
}

function getRules() {
  var configFile = getConfigFile()
  var config = getConfig(configFile)
  var rules = Object.keys(config.rules)
  return rules
}
