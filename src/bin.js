#!/usr/bin/env node

'use strict'

// Prints rules recognized by ESLint that don't appear in the given config
// preset. It helps with upgrading the preset when new ESLint gets released.
var RuleFinder = require('./rule-finder')
var specifiedFile = process.argv[2]
var ruleFinder = new RuleFinder(specifiedFile)

var newRules = ruleFinder.getNewRules()

if (newRules.length) {
  console.log('New rules to add to the config: ' + newRules.join(', ') + '.') // eslint-disable-line no-console
  process.exit(1)
}
