var rp = require('request-promise')
,	buildUrl = require('build-url');

var login = function(host, user, pass) {
	/* returns a promise with the session id
	*/
	// build url to location
	var uri = buildUrl(host,
	{
		path: "openmeetings/services/user/login"	
	})
	// build options to post
	var options = {
		uri: uri,
		qs: {
			user: user,
			pass: pass,
			type: "json"
		},
		json: true
	}
	// do the post
	var sid = rp(options);

	return sid.then(function(sessid) {
		if(sessid.serviceResult.type == "ERROR") {
			throw Error('Could connect to server, but credentials were wrong.');
		}
		return sessid
	});
};

var renew_login = function(sesstime, sessexp, host, user, pass, sid) {
	/* renew_login
	* 	renews the session every sessexp minutes
	*/
	// compare dates
	var d = new Date();
	var c = new Date(sesstime);
	c.setMinutes(c.getMinutes() + sessexp);
	// if the session has existed for longer than 30 minutes, renew it
	if(d > c) {
		sid = login(host, user, pass)
	}
	return sid;

};

var hash = function(userobj, opt, session, host, user, pass) {
/* hash
*  returns a promise with the user's room
*/
// try to renew_login and then
return session.then(function(sessid) {
	// build url
	var uri = buildUrl(host, {
		path: "openmeetings/services/user/hash"
	})
	// post user and options to server
	var options = {
		uri: uri,
		method: 'POST',
		qs: {
			sid: sessid.serviceResult.message,
			dataType: "json",
			user: JSON.stringify(userobj),
			options: JSON.stringify(opt)
		},
		json: true
	}
	// then return the promise
	return rp(options);
	});
};

module.exports = {
	login: login,
	renew_login: renew_login,
	hash: hash
}