var asArray = require('as-array')
var reduce = require('ramda/src/reduce')

module.exports = function command () {

  var definitions = asArray(arguments);

  return function (options) {

    var defineValue = reduce(function (accum, def) {

        accum[def.type] = (accum[def.type] || []).concat(def.value)
        return accum
      }, {})

    return {
      type: 'command',
      value: defineValue(definitions),
      options: options
    }
  }
}
