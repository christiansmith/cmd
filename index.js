var asArray = require('as-array')
var minimist = require('minimist')
var omit = require('ramda/src/omit')
var compose = require('ramda/src/compose')
var map = require('ramda/src/map')

var utils = require('cmd-utils')

var getCommands = utils.getCommands
var getFlags = utils.getFlags
var applyFunctions = utils.applyFunctions

module.exports = function cli () {

  // TODO: Need to flatten and merge the contexts
  //       for use with things like use()

  var contexts = asArray(arguments)

  return function (argv) {

    var input = minimist(argv)
    var data = input._
    var flags = omit('_')(input)

    var runCommands = compose(
      map(applyFunctions(data, flags)),
      getCommands(data)
    )

    var runFlags = compose(
      map(applyFunctions(data, flags)),
      getFlags(flags, contexts)
    )

    runFlags(contexts)
    runCommands(contexts)
  }
}
