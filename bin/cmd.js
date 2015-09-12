#!/usr/bin/env node

var cli = require('../')

var name = require('cmd-name')
var use = require('cmd-use')
var command = require('cmd-command')
var flag = require('cmd-flag')

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
