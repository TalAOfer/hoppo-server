const express = require('express')
const { emit } = require('nodemon')
const app = express()
const port = 3001
// const server = app.listen(port)
const io = require('socket.io')(port, {
  cors: {
    origin: '*'
  }
})

let serverPlayers = {}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

io.on('connection', connected)

function connected(socket) {
  socket.on('newPlayer', (player) => {
    console.log('id number: ' + socket.id + 'is connected')
    if(serverPlayers[socket.id] === undefined){
      serverPlayers[socket.id] = player
      console.log(serverPlayers[socket.id]);
    }
    console.log('current serverPlayers : ' + Object.keys(serverPlayers).length);
    // socket.emit('playerId', socket.id)
    io.emit('serverToClient', serverPlayers)
  })
  socket.on('disconnect', () => {
    delete serverPlayers[socket.id]
    console.log('Goodbye id :' + socket.id + ", has disconnected");
    console.log('current serverPlayers : ' + Object.keys(serverPlayers).length);
    io.emit('serverToClient', serverPlayers)
  })
  socket.on('updateToServer', (player) => {
    // console.log('update to server');
    serverPlayers[socket.id] = player
    io.emit('serverToClient', serverPlayers)
    // console.log('server to client')
  })

  // socket.on('update', data => console.log(`${data[0].position.x} -- ${data[0].position.y}`))
}