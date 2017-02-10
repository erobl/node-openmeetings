module.exports = require('./lib/openmeetings')

server = require('./lib/openmeetings').server('192.168.1.122:5080','aulavirtual', 'aulavirtual');

server.login()