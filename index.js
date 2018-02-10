var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
// tell the app to be served up at this port (same as WAMP or MAMP, just a different port)
const server = app.listen(3000, function() {
	console.log('listening on localhost:3000');
});

// plug in socket.io
io.on('connection', function(socket) {
	console.log('a user has connected');
	io.emit('chat message', { for: 'everyone', message: `${socket.id} is here to par TAY!!` });

	// listen for a message, and then send it where it needs to go
	socket.on('chat message', function(msg) {
		console.log('message: ', msg);

		// send a message event to all clients
		io.emit('chat message', { for: 'everyone', message: msg });
	});

	// listen for disconnet
	socket.on('disconnect', function() {
		console.log('a user disconnected');
		msg = `${socket.id} has left the building!`;
		io.emit('disconnect message', msg);
	});
});
