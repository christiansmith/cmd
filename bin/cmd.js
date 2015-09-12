#!/usr/bin/env node

var asArray = require('as-array')
var minimist = require('minimist')
var omit = require('ramda/src/omit')
var compose = require('ramda/src/compose')
var map = require('ramda/src/map')

var name = require('./name')
var use = require('./use')
var command = require('./command')
var flag = require('./flag')
var cmdUtils = require('./utils')
var getCommands = cmdUtils.getCommands;
var getFlags = cmdUtils.getFlags;
var applyFunctions = cmdUtils.applyFunctions;

exports.name = name
exports.use = use
exports.command = command
exports.flag = flag

var cli = exports.cli = function cli () {

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
