var userlib = require('./user.js')
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
			this.sessid = userlib.login(this.host, this.user, this.pass);
			this.sesstime = new Date();
			return this.sessid;
		},
		renew_login: function() {
			this.sessid = userlib.renew_login(this.sesstime, sessexp, this.host, this.user, this.pass);
			return this.sessid;
		},
		hash: function(userobj, opt) {
			var session = this.renew_login();
			console.log(session);
			return userlib.hash(userobj, opt, session, this.host, this.user, this.pass);
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