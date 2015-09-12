var namespace = require('tessed').namespace

var test = namespace('cli')
test.helpers = test.namespace('helpers')
test.exports = test.namespace('exports')

test('yes', function (t) {

  t.equal(true, true)
})
