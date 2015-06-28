var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var userList = {};


io.on('connection', function(socket) {

  userList[socket.id] = {};

  socket.on('add:user', function(user) {
    userList[socket.id]['user'] = user;
    socket.room = 'all';
    console.log(user.name + ' has joined room!');
    socket.join('all');
    socket.broadcast.to('all').emit('updateChat', 'SERVER', user.name + ' has joined room!');
    socket.emit('updateRooms', {room: 'all', userCount: userList.length});
    
  });

  socket.on('sendChat', function(data) {
    console.log(data); 
    console.log(JSON.stringify(userList[socket.id]));
    socket.to(socket.room).emit('updateChat', userList[socket.id]['user'], data);
  });



  socket.on('disconnect', function(){
    delete userList[socket.id];
    console.log('user disconnected ' + socket.id);
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});