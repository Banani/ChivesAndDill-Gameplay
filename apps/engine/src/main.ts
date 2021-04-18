import {
  CharacterDirection,
  ClientMessages,
  EngineMessages,
  Player,
} from '@bananos/types';
import { AREAS, BORDER } from './map';
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
  location: { x: 20, y: 20 },
  direction: CharacterDirection.DOWN,
  sprites: 'nakedFemale',
  isInMove: false,
});

let increment = 0;
const characters = {
  monster_1: {
    id: 'monster_1',
    name: `#monster_1`,
    location: { x: 320, y: 640 },
    direction: CharacterDirection.DOWN,
    sprites: 'pigMan',
    isInMove: false,
  },
  monster_2: {
    id: 'monster_1',
    name: `#monster_2`,
    location: { x: 420, y: 640 },
    direction: CharacterDirection.DOWN,
    sprites: 'pigMan',
    isInMove: false,
  },
  monster_3: {
    id: 'monster_1',
    name: `#monster_3`,
    location: { x: 1020, y: 940 },
    direction: CharacterDirection.DOWN,
    sprites: 'pigMan',
    isInMove: false,
  },
};
const areas = AREAS;
const playerMovement = new PlayersMovement(
  characters,
  [...areas, ...BORDER],
  (key) => {
    io.sockets.emit(EngineMessages.PlayerMoved, {
      playerId: key,
      newLocation: characters[key].location,
      newDirection: characters[key].direction,
    });
  }
);

setInterval(() => {
  playerMovement.doAction();
}, 1000 / 60);

io.on('connection', (socket) => {
  increment++;
  const player = createNewPlayer(increment);
  characters[increment] = player;

  socket.emit(EngineMessages.Inicialization, {
    activePlayer: increment,
    players: characters,
    areas,
  });

  socket.broadcast.emit(EngineMessages.UserConnected, { player });

  socket.on(ClientMessages.PlayerStartMove, (movement) => {
    socket.emit(EngineMessages.PlayerStartedMovement, { userId: player.id });
    socket.broadcast.emit(EngineMessages.PlayerStartedMovement, {
      userId: player.id,
    });
    playerMovement.startNewMovement(player.id, movement);
    characters[player.id].isInMove = true;
  });

  socket.on(ClientMessages.PlayerStopMove, (movement) => {
    socket.broadcast.emit(EngineMessages.PlayerStoppedMovement, {
      userId: player.id,
    });
    playerMovement.stopMovement(player.id, movement);
    characters[player.id].isInMove = playerMovement.isPlayerInMove(player.id);

    if (characters[player.id].isInMove === false) {
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
    delete characters[player.id];
  });
});
