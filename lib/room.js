var rp = require('request-promise')
,	buildUrl = require('build-url');

function GETroom(sess, method) {
	var uri = buildUrl(server.host,
	{
		path: "openmeetings/services/room" + method
	})
	var options = {
		uri: uri,
		qs: {
			sid: sess.serviceResult.message,
			type: "json"
		},
		json: true
	}
	var action = rp(options);
	return action;
}

var createRoom = function(server) {
	var room = {};

	room.kick = function(room) {
		return server.renew_login().then(function(sess) {
			return GETroom(sess, "/kick/" + room);
		});
	}

	room.close = function(room) {
		return server.renew_login().then(function(sess) {
			return GETroom(sess, "/close/" + room);
		});
	}

	room.open = function(room) {
		return server.renew_login().then(function(sess) {
			return GETroom(sess, "/open/" + room);
		});
	}

	room.get = function(room) {
		return server.renew_login().then(function(sess) {
			return GETroom(sess, "/" + room);
		});
	}
	
	return room;
}



module.exports = {
	createRoom: createRoom
}
