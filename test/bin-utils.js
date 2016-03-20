import test from 'ava'
import path from 'path'
import proxyquire from 'proxyquire'

const {getConfig, getCurrentRules, getPluginRules} = proxyquire('../bin-utils', {
  'eslint-plugin-react': {
    rules: {
      'foo-rule': true,
      'bar-rule': true,
      'baz-rule': true,
    },
    '@noCallThru': true,
    '@global': true,
  },
})

const processCwd = process.cwd

const noSpecifiedFile = path.resolve(process.cwd(), './fixtures/no-path')
const specifiedFileRelative = './fixtures/.eslintrc.js'
const specifiedFileAbsolute = path.join(process.cwd(), specifiedFileRelative)


test.beforeEach(() => {
  process.argv.splice(2, process.argv.length)
})

test.afterEach(() => {
  process.cwd = processCwd
})


test('determine config, rules and plugins, no path', t => {
  process.cwd = () => noSpecifiedFile

  const expectedRuleSet = ['no-alert']
  const expectedPluginRuleSet = []

  const retrievedConfig = getConfig()
  const retrievedRules = getCurrentRules(retrievedConfig)
  const possiblePluginRules = getPluginRules(retrievedConfig)

  t.true(typeof retrievedConfig === 'object', 'config object should be retrieved')

  t.true(typeof retrievedConfig.rules === 'object', 'config object should contain rules')
  t.same(retrievedRules, expectedRuleSet, 'retrieved rules should equal expected rules')

  t.true(typeof retrievedConfig.plugins === 'undefined', 'config object should not contain plugins')
  t.same(possiblePluginRules, expectedPluginRuleSet, 'retrieved plugin rules should equal expected plugin rules')
})

test('determine config, rules and plugins, relative path', t => {
  const expectedRuleSet = ['no-console']
  const expectedPluginRuleSet = ['react/foo-rule', 'react/bar-rule', 'react/baz-rule']

  const retrievedConfig = getConfig(specifiedFileRelative)
  const retrievedRules = getCurrentRules(retrievedConfig)
  const possiblePluginRules = getPluginRules(retrievedConfig)

  t.true(typeof retrievedConfig === 'object', 'config object should be retrieved')

  t.true(typeof retrievedConfig.rules === 'object', 'config object should contain rules')
  t.same(retrievedRules, expectedRuleSet, 'retrieved rules should equal expected rules')

  t.true(Array.isArray(retrievedConfig.plugins), 'config object should contain plugins')
  t.same(retrievedConfig.plugins, ['react'], 'retrieved plugins should contain only "react"')
  t.same(possiblePluginRules, expectedPluginRuleSet, 'retrieved plugin rules should equal expected plugin rules')
})

test('determine config, rules and plugins, absolute path', t => {
  const expectedRuleSet = ['no-console']
  const expectedPluginRuleSet = ['react/foo-rule', 'react/bar-rule', 'react/baz-rule']

  const retrievedConfig = getConfig(specifiedFileAbsolute)
  const retrievedRules = getCurrentRules(retrievedConfig)
  const possiblePluginRules = getPluginRules(retrievedConfig)

  t.true(typeof retrievedConfig === 'object', 'config object should be retrieved')

  t.true(typeof retrievedConfig.rules === 'object', 'config object should contain rules')
  t.same(retrievedRules, expectedRuleSet, 'retrieved rules should equal expected rules')

  t.true(Array.isArray(retrievedConfig.plugins), 'config object should contain plugins')
  t.same(retrievedConfig.plugins, ['react'], 'retrieved plugins should contain only "react"')
  t.same(possiblePluginRules, expectedPluginRuleSet, 'retrieved plugin rules should equal expected plugin rules')
})
