var rp = require('request-promise')
,	buildUrl = require('build-url');

/* createServer
*	creates a server object which can be used to 
*   connect to the openmeetings API
*/

function createServer(host, user, pass, sessexp) {
	sessexp = sessexp || 30;
	return {
		host: host,
		user: user,
		pass: pass,
		sesstime: new Date(0),
		login: function() {
		/* returns a promise with the session id
		*/
			// build url to location
			var uri = buildUrl(this.host,
			{
				path: "openmeetings/services/user/login"	
			})
			// renew datetime the session was created
			this.sesstime = new Date();
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
			this.sid = rp(options);

			return this.sid.then(function(sessid) {
				if(sessid.serviceResult.type == "ERROR") {
					throw Error('Could connect to server, but credentials were wrong.');
				}
			});
		},
		renew_login: function() {
			/* renew_login
			* 	renews the session every sessexp minutes
			*/
			// compare dates
			var d = new Date();
			var c = new Date(this.sesstime);
			c.setMinutes(c.getMinutes() + sessexp);
			// if the session has existed for longer than 30 minutes, renew it
			if(d > c) {
				this.login()
			}
			return this.sid;

		},
		hash: function(userobj, opt) {
			/* hash
			*  returns a promise with the user's room
			*/
			// try to renew_login and then
			return this.renew_login().then(function(sessid) {
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
		}
	}
};

function createUser(firstname, lastname, externalid, externaltype, login) {
	return {
		  firstname: firstname,
		  lastname: lastname,
		  externalId: externalid,
		  externalType: externaltype,
		  login: login
	}
}

function createOptions(roomid, moderator, showAudioVideoTest) {
	return {
	  roomId: roomid,
	  moderator: moderator,
	  showAudioVideoTest: showAudioVideoTest
    }

}


module.exports = {
	server: createServer,
	user: createUser,
	options: createOptions
}