import {
  CharacterDirection,
  ClientMessages,
  EngineMessages,
  Player,
} from '@bananos/types';
import { AREAS } from './map';
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
  location: { x: 0, y: 0 },
  direction: CharacterDirection.DOWN,
  sprites: 'nakedFemale',
  isInMove: false,
});

let increment = 0;
const players = {};
const areas = AREAS;
const playerMovement = new PlayersMovement(players, areas, (key) => {
  io.sockets.emit(EngineMessages.PlayerMoved, {
    playerId: key,
    newLocation: players[key].location,
    newDirection: players[key].direction,
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
    areas,
  });

  socket.broadcast.emit(EngineMessages.UserConnected, { player });

  socket.on(ClientMessages.PlayerStartMove, (movement) => {
    socket.emit(EngineMessages.PlayerStartedMovement, { userId: player.id });
    socket.broadcast.emit(EngineMessages.PlayerStartedMovement, {
      userId: player.id,
    });
    playerMovement.startNewMovement(player.id, movement);
    players[player.id] = {
      ...players[player.id],
      isInMove: true,
    };
  });

  socket.on(ClientMessages.PlayerStopMove, (movement) => {
    socket.broadcast.emit(EngineMessages.PlayerStoppedMovement, {
      userId: player.id,
    });
    playerMovement.stopMovement(player.id, movement);
    players[player.id].isInMove = playerMovement.isPlayerInMove(player.id);

    if (players[player.id].isInMove === false) {
      socket.emit(EngineMessages.PlayerStoppedMovement, { userId: player.id });
      socket.broadcast.emit(EngineMessages.PlayerStoppedMovement, {
        userId: player.id,
      });
    }
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit(EngineMessages.UserDisconnected, {
      userId: player.id,
    });
    delete players[player.id];
  });
});
