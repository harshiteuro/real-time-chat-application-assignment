const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//Socket.io logic for handling connections
io.on('connection', (socket) => {
  console.log('A user connected');

  //Handle user joining a room
  socket.on('join', (room,username) => {
    socket.join(room);
    io.to(room).emit('message', `${username} user has joined the room`);
  });

  //Handle incoming messages
  socket.on('message', (data) => {
    io.to(data.room).emit('message', data.name+":"+data.text);
  });

  //Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

//Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
