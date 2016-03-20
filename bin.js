#!/usr/bin/env node

'use strict'

// Prints rules recognized by ESLint that don't appear in the given config
// preset. It helps with upgrading the preset when new ESLint gets released.
var binUtils = require('./bin-utils')
var findNewRules = require('./index')

var config = binUtils.getConfig(process.argv[2])
var currentRules = binUtils.getCurrentRules(config)
var pluginRules = binUtils.getPluginRules(config)

var newRules = findNewRules(currentRules, pluginRules)

if (newRules.length) {
  console.log('New rules to add to the config: ' + newRules.join(', ') + '.') // eslint-disable-line no-console
  process.exit(1)
}
