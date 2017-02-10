var rp = require('request-promise')
,	buildUrl = require('build-url');

/* createServer
*	creates a server object which can be used to 
*   connect to the openmeetings API
*/

function createServer(host, user, pass) {
	return {
		host: host,
		user: user,
		pass: pass,
		login: function() {
		/* returns a promise with the session id
		*/
			var uri = buildUrl(this.host,
			{
				path: "/services/user/login"	
			})
			var options = {
				uri: uri,
				qs: {
					user: user,
					pass: pass,
					type: "json"
				},
				json: true
			}
			this.sid = rp(options);
			return this.sid;
		},
		hash: function(userobj) {
			/* hash
			*  returns a promise with the user's room
			*/
			return this.sid.then(function(sessid) {
				var uri = buildUrl(this.host, {
					path: "/services/user/hash"
				})
				userobj.externalType = userobj.externalType || "nodeJSApp"
				var options = {
					uri: uri,
					method: 'POST',
					body: userobj,
					qs: {
						sid: sessid
					},
					json: true
				}
				return rp(options);
			})
		}
	}
};

module.exports = {
	server: createServer
}