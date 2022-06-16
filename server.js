const express = require('express')
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

function connected(socket){
  socket.emit('serverToClient' , '')
  socket.on('newPlayer', (data) => {
    console.log('id number: ' + socket.id + 'is connected')
    players[socket.id] = data
    console.log('current players : ' + Object.keys(players).length);
    for(let id in players){
      console.log(`${players[id].x} is x -- ${players[id].y} is y`);
    }
  })
    socket.on('disconnect', () => {
      delete players[socket.id]
      console.log('Goodbye id :' + socket.id +", has disconnected");
      console.log('current players : ' + Object.keys(players).length);
      for(let id in players){
        console.log(`${players[id].x} is x -- ${players[id].y} is y`);
      }
    })
    // socket.on('update', data => console.log(`${data[0].position.x} -- ${data[0].position.y}`))
}