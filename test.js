var namespace = require('tessed').namespace

var test = namespace('cli')
test.exports = test.namespace('exports')

test('yes', function (t) {

  t.equal(true, true)
})
