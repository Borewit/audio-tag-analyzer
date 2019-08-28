const test = require('tape')

// writing tests for this would be hard, so let's just check that requiring the module
// doesn't throw

test('requiring drag-drop does not throw', t => {
  t.doesNotThrow(() => {
    require('../')
  })
  t.end()
})
