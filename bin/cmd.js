#!/usr/bin/env node

var asArray = require('as-array')
var minimist = require('minimist')

var name = require('./name')
var use = require('./use')
var command = require('./command')
var flag = require('./flag')

var map = require('ramda/src/map')
var compose = require('ramda/src/compose')
var apply = require('ramda/src/apply')
var filter = require('ramda/src/filter')
var prop = require('ramda/src/prop')
var equals = require('ramda/src/equals')
var contains = require('ramda/src/contains')
var head = require('ramda/src/head')
var or = require('ramda/src/or')
var not = require('ramda/src/not')
var omit = require('ramda/src/omit')
var path = require('ramda/src/path')
var flip = require('ramda/src/flip')
var curryN = require('ramda/src/curryN')
var keys = require('ramda/src/keys')

var getAlias = path(['value', 'alias'])
var valueDoesNotHaveAlias = compose(not, getAlias)
var isCommand = compose(equals('command'), prop('type'))
var isFlag = compose(equals('flag'), prop('type'))
var applyFunctions = curryN(3, function applyFunctions (data, flags, com) {

  return compose(
    map(flip(apply)([data, flags, com.options])),
    path(['value', 'function'])
  )(com)
})
function containsAlias (data, def) {

  return compose(contains(head(data)), flip(or)([]), getAlias)(def)
}
var matchAlias = curryN(2, function matchAlias (data, def) {

  return or(valueDoesNotHaveAlias(def), containsAlias(data, def))
})
function getCommands (data) {

  return compose(
    filter(matchAlias(data)),
    filter(isCommand)
  )
}
function getFlags (flags, contexts) {

  var matchFlagAliases = compose(
    matchAlias,
    keys
  )

  return compose(
    filter(matchFlagAliases(flags)), // TODO: need to format flags input
    filter(isFlag)
  )
}

function cli () {

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

module.exports = {
  cli: cli,
  name: name,
  use: use,
  command: command,
  flag: flag
}

var f = flag(
  name('-f', '--flaggy'),
  use(function () {

    console.log('f flag')
  }),
  use(function () {

    console.log('another func on f flag')
  })
)

var c = command(
  name('me'),
  use(function () {

    console.log('me command')
  }),
  use(function () {

    console.log('another me command function')
  })
)

var run = cli(
  c({option: 'one'}),
  f()
)

run(process.argv.slice(2))
