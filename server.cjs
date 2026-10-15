const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Client connectat:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client desconnectat:', socket.id);
  });
});
 
server.listen(3000, () => {
  console.log('Servidor escoltant al port 3000');
});