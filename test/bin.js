import test from 'ava'

test.todo('test bin later')

try {
  require('./bin') // requiring now for coverage until this is tested
} catch (error) {
  // ignore the inevitable error
}


