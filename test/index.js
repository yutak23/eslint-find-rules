import proxyquire from 'proxyquire'
import test from 'ava'

const findNewRules = proxyquire('../index', {
  fs: {
    readdirSync: () => ['foo-rule.js', 'bar-rule.js', 'baz-thing.js'],
  },
})

test('returns the difference between what it finds in eslint/lib/rules and the rules array it is passed', t => {
  const missingRules = findNewRules(['baz-thing', 'foo-rule'], ['react-foo'])
  t.same(missingRules, ['bar-rule', 'react-foo'])
})

test('returns an empty array if there is no difference', t => {
  const missingRules = findNewRules(['baz-thing', 'foo-rule', 'bar-rule'])
  t.true(Array.isArray(missingRules))
  t.same(missingRules.length, 0)
})
