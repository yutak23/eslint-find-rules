import test from 'ava'
import path from 'path'
import proxyquire from 'proxyquire'

let rules = []
const processCwd = process.cwd
const processExit = process.exit
const consoleLog = console.log // eslint-disable-line no-console
const specifiedFile = './fixtures/.eslintrc'
const mainFile = path.join(process.cwd(), specifiedFile)
const indexStub = {
  './index': () => rules,
}
function outputStatement() {
  return `New rules to add to the config: ${rules.join(', ')}.`
}

test.beforeEach((t) => {
  process.argv.splice(2, process.argv.length)
  process.exit = status => t.same(status, 1)
  console.log = statement => t.same(statement, outputStatement()) // eslint-disable-line no-console
})

test.afterEach(() => {
  process.cwd = processCwd
  process.exit = processExit
  console.log = consoleLog // eslint-disable-line no-console
})

test('no new rule and absolute path', () => {
  process.argv[2] = mainFile
  proxyquire('../bin', indexStub)
})

test('no new rule and relative path', () => {
  process.argv[2] = specifiedFile
  proxyquire('../bin', indexStub)
})

test('no new rule and no path', () => {
  process.cwd = () => mainFile
  proxyquire('../bin', indexStub)
})

test('new rule and absolute path', () => {
  rules = ['foo']
  process.argv[2] = mainFile
  proxyquire('../bin', indexStub)
})

test('new rule and relative path', () => {
  rules = ['foo', 'bar']
  process.argv[2] = specifiedFile
  proxyquire('../bin', indexStub)
})

test('new rule and no path', () => {
  rules = ['foo', 'bar', 'baz']
  process.cwd = () => mainFile
  proxyquire('../bin', indexStub)
})
