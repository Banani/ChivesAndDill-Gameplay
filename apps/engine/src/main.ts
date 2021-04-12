import { CharacterDirection, ClientMessages, EngineMessages, Player } from '@bananos/types';
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

const createNewPlayer = (increment: number): Player => ({
    id: increment.toString(),
    name: `#player_${increment}`,
    location: { x: Math.random() * 300, y: Math.random() * 300 },
    direction: CharacterDirection.DOWN,
    sprites: "nakedFemale",
    isInMove: false
  });

let increment = 0;
const players = {};
const playerMovement = new PlayersMovement(players, (key) => {
  io.sockets.emit(EngineMessages.PlayerMoved, {
    playerId: key,
    newLocation: players[key].location,
  });
});

setInterval(() => {
  playerMovement.doAction();
}, 1000 / 60);


io.on('connection', (socket) => {
  increment++;
  const player = createNewPlayer(increment);
  players[increment] = player;

  socket.emit(EngineMessages.Inicialization, {
    players,
  });

  socket.broadcast.emit(EngineMessages.UserConnected, { player });

  socket.on(ClientMessages.PlayerStartMove, (movement) => {
    socket.broadcast.emit(EngineMessages.PlayerStartedMovement, {userId: player.id});
    playerMovement.startNewMovement(player.id, movement);
    players[player.id] = {
        ...players[player.id],
        isInMove: true
    };
  });

  socket.on(ClientMessages.PlayerStopMove, (movement) => {
    socket.broadcast.emit(EngineMessages.PlayerStoppedMovement, {userId: player.id});
    playerMovement.stopMovement(player.id, movement);
    players[player.id] = {
        ...players[player.id],
        isInMove: false
    };
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit(EngineMessages.UserDisconnected, { userId: player.id });
    delete players[player.id];
  });
});
