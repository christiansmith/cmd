var asArray = require('as-array')
var reduce = require('ramda/src/reduce')
var map = require('ramda/src/map')

module.exports = function flag () {

  var definitions = asArray(arguments);

  return function (options) {

    var defineValue = reduce(function (accum, def) {

        var value = def.value

        if (def.type === 'alias') {
          value = map(function (val) {

            return val.replace(/^-+/, '')
          }, def.value)
        }

        accum[def.type] = (accum[def.type] || []).concat(value)
        return accum
      }, {})

    return {
      type: 'flag',
      value: defineValue(definitions),
      options: options
    }
  }
}
