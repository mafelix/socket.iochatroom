
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(request, response){
  response.sendFile(__dirname + '/index.html');
});

usernames = {};
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('a user has disconnected');
  });
 
  socket.on('adduser', function(name){
    socket.name = name
    usernames[name] = name

    socket.broadcast.emit('updatechat', socket.name + ' has connected');
    io.sockets.emit('updateusers', usernames);
    // console.log(usernames);
    io.sockets.emit('updateCount', (io.engine.clientsCount));
  })
  socket.on('chat_message', function(msg){
    io.sockets.emit('chat_message', socket.name + ": " + msg);
  })


  socket.on('disconnect', function(){
    // deleting socket property name from usernames object
    delete usernames[socket.name];
    // updating ALL sockets about new users list/ passing it usernames object
    io.sockets.emit('updateusers', usernames);
    // updating chat box with message of disconnected user
    socket.broadcast.emit('updatechat', socket.name + " has disconnected");
    io.sockets.emit('updateCount', (io.engine.clientsCount ));
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});