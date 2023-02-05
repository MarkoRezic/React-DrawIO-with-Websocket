var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var users = {}

io.on('connection', (socket) => {
      console.log('User Connected', socket.id);
      socket.on('login', ({ previousId, newId, username }) => {
            if (users?.[previousId] == null) {
                  console.log('New User Joined', username);
                  users[newId] = {
                        username
                  }
            }
            else {
                  console.log('User Joined', username);
                  delete users[previousId]
                  users[newId] = {
                        username
                  }
            }
            io.sockets.emit('user-joined', { userList: users, userId: newId });
            console.log(users)
            //socket.broadcast.to(roomName).emit('user_leave', {user_name: "johnjoe123"});
      });

      socket.on('canvas-data', ({ data, id }) => {
            socket.broadcast.emit('canvas-data', { data, id });

      })

      socket.on('disconnect', function () {
            console.log('User Disconnected', socket.id);
            //socket.broadcast.to(roomName).emit('user_leave', {user_name: "johnjoe123"});
      });
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
      console.log("Started on : " + server_port);
})