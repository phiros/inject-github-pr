'use strict'

var pull_request = require('./pull_request.js')
var Wreck = require('wreck')
var uuid = require('node-uuid')
var btoa = require('btoa')

var id = uuid.v1()
var project = { 'id': id, 'name': 'RIOT-OS', 'environments': [], 'provider': {'type': 'github'}}

var core_url = 'http://localhost:8000'

if (process.env.CORE_URL) {
  core_url = process.env.CORE_URL
}

if (process.argv[2]) {
  id = process.argv[2]
} else {
  // first auth
  Wreck.get(core_url + '/api/v1/users/login', {
    'headers': {
      Authorization: 'Basic ' + btoa('admin' + ':' + 'admin')
    },
  'payload': JSON.stringify(project)},
    function (err, res, payload) {
      if (err) {
        console.log('post project err', err)
        return
      }
      console.log('res', res)
      console.log('payload', payload)
      var token = res.headers.authorization

      Wreck.post(core_url + '/api/v1/projects', {
        'headers': {
          Authorization: token
        },
        'payload': JSON.stringify(project)}, function (err, res, payload) {
        if (err) {
          console.log('post project err', err)
          return
        }
        console.log('project id: ', id)
      })
    })
}

var wreck = Wreck.defaults({
  headers: { 'x-github-event': 'pull_request' }
})

wreck.post(core_url + '/api/v1/projects/' + id + '/webhooks/github', {'payload': JSON.stringify(pull_request)}, function (err, res, payload) {
  if (err) {
    console.log('post github job err', err)
    return
  }
})
