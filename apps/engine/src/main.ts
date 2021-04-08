import { EngineEvents } from '@bananos/types';
import { PlayersMovement } from './playersMovement';

const hostname = '127.0.0.1';
const port = 3000;

const httpServer = require('http').createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
  },
});

httpServer.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

let increment = 0;
const players = {};
const playerMovement = new PlayersMovement(players, (key) => {
  io.sockets.emit('player_moved', {
    playerId: key,
    newLocation: players[key].location,
  });
});

setInterval(() => {
  playerMovement.doAction();
}, 1000 / 60);

io.on('connection', (socket) => {
  increment++;
  const player = {
    id: increment,
    name: `#player_${increment}`,
    location: { x: Math.random() * 300, y: Math.random() * 300 },
    direction: 2,
    image: 'http://localhost:4200/assets/spritesheets/teemo.png',
  };
  players[increment] = player;

  socket.emit(EngineEvents.Inicialization, {
    players,
  });

  socket.broadcast.emit(EngineEvents.UserConnected, { player });
  console.log('new player connected', player, player.id);

  socket.on(EngineEvents.PlayerMove, (movement) => {
    console.log(movement);
    playerMovement.startNewMovement(player.id, movement);
  });

  socket.on(EngineEvents.PlayerStopMove, (movement) => {
    playerMovement.stopMovement(player.id, movement);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
    delete players[player.id];
    socket.broadcast.emit(EngineEvents.UserDisconnected, { userId: player.id });
  });
});
