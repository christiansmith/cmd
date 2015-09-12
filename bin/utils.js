var compose = require('ramda/src/compose')
var path = require('ramda/src/path')
var not = require('ramda/src/not')
var equals = require('ramda/src/equals')
var prop = require('ramda/src/prop')
var curryN = require('ramda/src/curryN')
var map = require('ramda/src/map')
var flip = require('ramda/src/flip')
var apply = require('ramda/src/apply')
var contains = require('ramda/src/contains')
var head = require('ramda/src/head')
var or = require('ramda/src/or')
var filter = require('ramda/src/filter')
var keys = require('ramda/src/keys')

var getAlias = exports.getAlias = path(['value', 'alias'])
var valueDoesNotHaveAlias = exports.valueDoesNotHaveAlias = compose(not, getAlias)
var isCommand = exports.isCommand = compose(equals('command'), prop('type'))
var isFlag = exports.isFlag = compose(equals('flag'), prop('type'))

var applyFunctions = exports.applyFunctions = curryN(3, function applyFunctions (data, flags, com) {

  return compose(
    map(flip(apply)([data, flags, com.options])),
    path(['value', 'function'])
  )(com)
})

var containsAlias = exports.containsAlias = function containsAlias (data, def) {

  return compose(contains(head(data)), flip(or)([]), getAlias)(def)
}

var matchAlias = exports.matchAlias = curryN(2, function matchAlias (data, def) {

  return or(valueDoesNotHaveAlias(def), containsAlias(data, def))
})

var getCommands = exports.getCommands = function getCommands (data) {

  return compose(
    filter(matchAlias(data)),
    filter(isCommand)
  )
}

var getFlags = exports.getFlags = function getFlags (flags) {

  var matchFlagAliases = compose(
    matchAlias,
    keys
  )

  return compose(
    filter(matchFlagAliases(flags)), // TODO: need to format flags input
    filter(isFlag)
  )
}
