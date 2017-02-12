# node-openmeetings
A library that acts as high-level bindings to the openmeetings REST API using request-promises to fulfill them.

Implemented as per http://openmeetings.apache.org/openmeetings-webservice/apidocs/index.html

###Install

    npm install openmeetings

###Usage

```javascript
om = require('openmeetings');
server = om.server('localhost:5080', 'myuser', 'mypass');
```

Alternatively, you can set the session renewal time to something different than its default of 30 minutes:

```javascript
server = om.server('localhost:5080', 'myuser', 'mypass', 100); // we renew our session every 100 minutes
```

After that you're free to log in.

```javascript
server.login();
``` 

###Examples
```javascript
user = om.user("John", "Doe", "externalId1", "myAwesomeNodeApp", "superjohn");
// join room 5, as moderator, ask user to set up their webcam
options = om.options(5, true, true) 
server.hash(user, options).then(function(hash) {
	// we get our room hash, and now we can join 
	// the room at localhost:5080/openmeetings/swf?secureHash=[hash]
	console.log(hash.serviceResult.message); 
});
```

