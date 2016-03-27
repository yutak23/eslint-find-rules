import path from 'path'

import test from 'ava'
import proxyquire from 'proxyquire'

const processCwd = process.cwd

const RuleFinder = proxyquire('../src/rule-finder', {
  fs: {
    readdirSync: () => ['foo-rule.js', 'bar-rule.js', 'baz-rule.js'],
  },
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

const noSpecifiedFile = path.resolve(process.cwd(), './fixtures/no-path')
const specifiedFileRelative = './fixtures/eslint.json'
const specifiedFileAbsolute = path.join(process.cwd(), specifiedFileRelative)

test.afterEach(() => {
  process.cwd = processCwd
})

test('no specifiedFile is passed to the constructor', (t) => {
  process.cwd = () => noSpecifiedFile
  const ruleFinder = new RuleFinder()
  t.same(ruleFinder.getNewRules(), ['bar-rule', 'baz-rule'])
})

test('no specifiedFile - curent rules', (t) => {
  process.cwd = () => noSpecifiedFile
  const ruleFinder = new RuleFinder()
  t.same(ruleFinder.getCurrentRules(), ['foo-rule'])
})

test('no specifiedFile - plugin rules', (t) => {
  process.cwd = () => noSpecifiedFile
  const ruleFinder = new RuleFinder()
  t.same(ruleFinder.getPluginRules(), [])
})

test('no specifiedFile - all available rules', (t) => {
  process.cwd = () => noSpecifiedFile
  const ruleFinder = new RuleFinder()
  t.same(ruleFinder.getAllAvailableRules(), ['foo-rule', 'bar-rule', 'baz-rule'])
})

test('specifiedFile (relative path) is passed to the constructor', (t) => {
  const ruleFinder = new RuleFinder(specifiedFileRelative)
  t.same(ruleFinder.getNewRules(), ['baz-rule', 'react/foo-rule', 'react/bar-rule', 'react/baz-rule'])
})

test('specifiedFile (relative path) - curent rules', (t) => {
  const ruleFinder = new RuleFinder(specifiedFileRelative)
  t.same(ruleFinder.getCurrentRules(), ['foo-rule', 'bar-rule'])
})

test('specifiedFile (relative path) - plugin rules', (t) => {
  const ruleFinder = new RuleFinder(specifiedFileRelative)
  t.same(ruleFinder.getPluginRules(), ['react/foo-rule', 'react/bar-rule', 'react/baz-rule'])
})

test('specifiedFile (relative path) - all available rules', (t) => {
  const ruleFinder = new RuleFinder(specifiedFileRelative)
  t.same(
    ruleFinder.getAllAvailableRules(),
    ['foo-rule', 'bar-rule', 'baz-rule', 'react/foo-rule', 'react/bar-rule', 'react/baz-rule']
  )
})

test('specifiedFile (absolut path) is passed to the constructor', (t) => {
  const ruleFinder = new RuleFinder(specifiedFileAbsolute)
  t.same(ruleFinder.getNewRules(), ['baz-rule', 'react/foo-rule', 'react/bar-rule', 'react/baz-rule'])
})

test('specifiedFile (absolut path) - curent rules', (t) => {
  const ruleFinder = new RuleFinder(specifiedFileAbsolute)
  t.same(ruleFinder.getCurrentRules(), ['foo-rule', 'bar-rule'])
})

test('specifiedFile (absolut path) - plugin rules', (t) => {
  const ruleFinder = new RuleFinder(specifiedFileAbsolute)
  t.same(ruleFinder.getPluginRules(), ['react/foo-rule', 'react/bar-rule', 'react/baz-rule'])
})

test('specifiedFile (absolut path) - all available rules', (t) => {
  const ruleFinder = new RuleFinder(specifiedFileAbsolute)
  t.same(
    ruleFinder.getAllAvailableRules(),
    ['foo-rule', 'bar-rule', 'baz-rule', 'react/foo-rule', 'react/bar-rule', 'react/baz-rule']
  )
})
