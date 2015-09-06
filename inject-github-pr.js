'use strict'

var pull_request = require('./pull_request.js')
var Wreck = require('wreck');
var uuid = require('node-uuid')

var id = uuid.v1()
var project = { 'id': id, 'name': 'RIOT-OS', 'environments': [], 'provider': {'type': 'github'}}

if(process.argv[2]) {
  id = process.argv[2]
} else {
Wreck.post('http://localhost:8000/api/v1/projects', {'payload': JSON.stringify(project)}, function (err, res, payload) {
  if(err) {
    console.log('post project err', err)
    return
  }
  console.log('project id: ', id)
});
}

var wreck = Wreck.defaults({
    headers: { 'x-github-event': 'pull_request' }
});

wreck.post('http://localhost:8000/api/v1/projects/' + id  + '/webhooks/github', {'payload': JSON.stringify(pull_request)}, function (err, res, payload) {
  if(err) {
    console.log('post github job err', err)
    return
  }
});
