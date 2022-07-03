const express = require('express')
const { emit } = require('nodemon')
const app = express()
const port = process.env.port || 3001
const http = require('http').Server(app)
// const server = app.listen(port)
const io = require('socket.io')(port, {
  cors: {
    origin: '*'
  }
})

let serverPlayers = {}
let room = {}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
})

console.log('server is up');

io.on('connection', connected)

function connected(socket) {
  socket.on('newPlayer', (player) => {
    console.log('id number: ' + socket.id + 'is connected')
    if (serverPlayers[socket.id] === undefined) {
      serverPlayers[socket.id] = player
      console.log(serverPlayers[socket.id]);
    }
    console.log('current serverPlayers : ' + Object.keys(serverPlayers).length);
    // socket.emit('playerId', socket.id)
    io.emit('newPlayerToClient', {serverPlayers, createdPlayerId: socket.id})
  })
  socket.on('disconnect', () => {
    delete serverPlayers[socket.id]
    console.log('Goodbye id :' + socket.id + ", has disconnected");
    console.log('current serverPlayers : ' + Object.keys(serverPlayers).length);
    console.log(serverPlayers);
    io.emit('disconnectToClient', socket.id)
  })
  socket.on('updateToServer', (player) => {
    // console.log('update to server');
    serverPlayers[socket.id] = player
    io.emit('serverToClient', serverPlayers)
    // console.log('server to client')
  })

  socket.on('endGame', () => {
    // console.log('update to server');
    serverPlayers = {}
    console.log(serverPlayers);
    // io.emit('serverToClient', serverPlayers)
    // console.log('server to client')
  })


  // socket.on('update', data => console.log(`${data[0].position.x} -- ${data[0].position.y}`))
}