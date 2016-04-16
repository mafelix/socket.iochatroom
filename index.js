
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
  socket.on('chat_message', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('chat_message', function(msg){
    io.sockets.emit('chat_message', msg);
  });


  socket.on('adduser', function(name){
    socket.name = name
    usernames[name] = name

    socket.broadcast.emit('updatechat', socket.name + 'has connected');
    io.emit('updateusers', usernames);
    console.log(usernames);
  })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});