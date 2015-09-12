var asArray = require('as-array')

module.exports = function use () {

  return {
    type: 'function',
    value: asArray(arguments)
  }
}
