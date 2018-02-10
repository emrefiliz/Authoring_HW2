// initialize our app and tell it to use some plugins from the modules folder
const express = require('express');
const app = express();
const io = require('socket.io')();

// some config stuff
const PORT = process.env.port || 3000;

// tell our app to serve static files from the public folder
app.use(express.static('public'));

app.use(require('./routes/index'));

// tell the app to be served up at this port (same as WAMP or MAMP, just a different port)
const server = app.listen(3000, function() {
  console.log('Listening on localhost:3000');
});

io.attach(server);

// Count people in room
var numUsers = 0;

// plug in socket.io
io.on('connection', function(socket) {

  ++numUsers;
  if (numUsers == 1) {
    console.log(numUsers + ' user is in this chatroom.');
  } else {
    console.log(numUsers + ' users are in this chatroom.');
  }

  console.log(socket.id + ' has connected');
  //io.emit('chat message', { for: 'everyone', message: `${socket.id} has joined the channel.` });

  // listen for a message, and then send it where it needs to go
  socket.on('chat message', function(msg) {
    // send a message event to all clients
    io.emit('chat message', {
      for: 'everyone',
      message: msg
    });
  });

  // listen for disconnet
  socket.on('disconnect', function() {
    --numUsers;
    console.log(socket.id + ' has disconnected');
    msg = `${socket.id} has left the channel.`;
    io.emit('disconnect message', msg);
    if (numUsers == 1) {
      console.log(numUsers + ' user is in this chatroom.');
    } else {
      console.log(numUsers + ' users are in this chatroom.');
    }
  });

});
