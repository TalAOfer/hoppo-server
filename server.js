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

let players = {}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

io.on('connection', connected)

function connected(socket) {
  socket.on('newPlayer', (data) => {
    console.log('id number: ' + socket.id + 'is connected')
    players[socket.id] = data
    console.log('current players : ' + Object.keys(players).length);
    for (let id in players) {
      // console.log(players[id]);
    }
    socket.emit('playerId', socket.id)
    io.emit('serverToClient', players)
  })
  socket.on('disconnect', () => {
    delete players[socket.id]
    console.log('Goodbye id :' + socket.id + ", has disconnected");
    console.log('current players : ' + Object.keys(players).length);
    io.emit('serverToClient', players)
  })
  socket.on('updateToServer', (data) => {
    // console.log('update to server');
    players[socket.id] = data
    io.emit('serverToClient', players)
    // console.log('server to client')
  })

  // socket.on('update', data => console.log(`${data[0].position.x} -- ${data[0].position.y}`))
}