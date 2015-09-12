var asArray = require('as-array')

module.exports = function name () {

  return {
    type: 'alias',
    value: asArray(arguments)
  }
}
